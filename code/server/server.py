from config import *

import re
import os
import cv2
import time
import json
import base64
import shutil
import datetime
import threading
import numpy as np

from bottle import route, run, static_file, request, BaseRequest, response

from ai import *
from tricks import *


BaseRequest.MEMFILE_MAX = 10000 * 1000


def get_request_image(name):
    img = request.forms.get(name)
    img = re.sub('^data:image/.+;base64,', '', img)
    img = base64.urlsafe_b64decode(img)
    img = np.fromstring(img, dtype=np.uint8)
    img = cv2.imdecode(img, -1)
    return img


@route('/<filename:path>')
def send_static(filename):
    return static_file(filename, root='./game')


@route('/')
def send_static():
    return static_file("index.html", root='./game')


sketch_upload_pool = []
painting_pool = []


def handle_sketch_upload_pool():
    if len(sketch_upload_pool) > 0:
        # print input sketch's resolution
        sketch_real_resolution=int(1024*get_sketch_resolution_factor())
        percentage_for_print=format(get_sketch_resolution_factor(), '.0%')
        print('Currently all input sketch will be resized to {0} px ({1})'.format(str(sketch_real_resolution),percentage_for_print))
        
        room, sketch, method = sketch_upload_pool[0]
        del sketch_upload_pool[0]
        room_path = 'game/rooms/' + room
        # try to get ID from "room id" string
        room_datetime_str=room[0:room.find('R')]
        room_datetime=datetime.datetime.strptime(room_datetime_str,'%b%dH%HM%MS%S')
        ID=room_datetime.strftime('H%HM%MS%S')
        
        # Process sketch
        print('processing sketch... (room: ' + room_path + ')')
        if os.path.exists(room_path + '/sketch.improved.jpg'):
            improved_sketch = cv2.imread(room_path + '/sketch.improved.jpg')
            print('lucky to find improved sketch')
        else:
            improved_sketch = sketch.copy()
            # tweak the input sketch's resolution by factor
            tweaked_input_resolution=int(512 * get_sketch_resolution_factor())
            improved_sketch = min_resize(improved_sketch, tweaked_input_resolution)
            improved_sketch = cv_denoise(improved_sketch)
            improved_sketch = sensitive(improved_sketch, s=5.0)
            improved_sketch = go_tail(improved_sketch)
            cv2.imwrite(room_path + '/sketch.improved.jpg', improved_sketch)
            # save processed sketch for download
            cv2.imwrite(room_path + '/result.' + ID + '.jpg', improved_sketch)
        color_sketch = improved_sketch.copy()
        
        # Extract sketch from painting
        std = cal_std(color_sketch)
        print('std = ' + str(std))
        need_de_painting = (std > 100.0) and method == 'rendering'
        if method=='recolorization' or need_de_painting:
            if os.path.exists(room_path + '/sketch.recolorization.jpg') or os.path.exists(room_path + '/sketch.de_painting.jpg'):
                print('lucky to find lined sketch')
            else:
                print('Extracting sketch from painting...')
                improved_sketch = go_passline(color_sketch)
                improved_sketch = min_k_down_c(improved_sketch, 2)
                improved_sketch = cv_denoise(improved_sketch)
                improved_sketch = go_tail(improved_sketch)
                improved_sketch = sensitive(improved_sketch, s=5.0)
                cv2.imwrite(room_path + '/sketch.recolorization.jpg', min_black(improved_sketch))
                # save extracted sketch for download
                cv2.imwrite(room_path + '/result.' + ID + '.jpg', min_black(improved_sketch))
                if need_de_painting:
                    cv2.imwrite(room_path + '/sketch.de_painting.jpg', min_black(improved_sketch))
                    print('In rendering mode, the user has uploaded a painting, and I have translated it into a sketch.')
                print('sketch lined')
        cv2.imwrite(room_path + '/sketch.colorization.jpg', min_black(color_sketch))
        cv2.imwrite(room_path + '/sketch.rendering.jpg', eye_black(color_sketch))
        print('sketch improved')
    return


def handle_painting_pool():
    if len(painting_pool) > 0:
        room, ID, sketch, alpha, reference, points, method, lineColor, line = painting_pool[0]
        del painting_pool[0]
        room_path = 'game/rooms/' + room
        print('processing painting in ' + room_path)

        # Check cache
        cache_path=room_path + '/cache'
        last_points_json_path=cache_path+'/last_hint_points.json'
        last_composition_path=cache_path+'/composition_'+ method +'.jpg' # note that different mode needs individual cache
        
        # check whether cache is valid
        is_draft_cache_valid = False
        if True == is_draft_cache_enabled and os.path.exists(last_composition_path): # whether draft(composion) under current mode exists in cache
            if os.path.exists(last_points_json_path): # whether last_draft_points exists in cache
                # load last_draft_points from cache
                with open(last_points_json_path, 'r', encoding='utf-8') as points_json_file:
                    last_draft_points=json.load(points_json_file)
                
                # check difference
                # create a list of current draft points
                current_draft_points=[]
                for point in points:
                    x, y, r, g, b, t = point
                    if 0 == t:# type is draft points
                        current_draft_points.append(point)

                # check whether draft hint points are the same with the previous step
                if current_draft_points == last_draft_points:
                    # draft hint points remain the same with the previous step
                    # so draft cache is valid
                    is_draft_cache_valid = True
                    print('draft points remain the same, draft cache is valid.')

        # tweak the input sketch's resolution by factor
        tweaked_input_resolution=int(64 * get_sketch_resolution_factor())

        if False == is_draft_cache_enabled or False == is_draft_cache_valid: # draft cache is disabled or invalid
            print('sketch pre-processing... (1/4)')
            sketch_1024 = k_resize(sketch, tweaked_input_resolution)
            if os.path.exists(room_path + '/sketch.de_painting.jpg') and method == 'rendering':
                vice_sketch_1024 = k_resize(cv2.imread(room_path + '/sketch.de_painting.jpg', cv2.IMREAD_GRAYSCALE), tweaked_input_resolution)
                sketch_256 = mini_norm(k_resize(min_k_down(vice_sketch_1024, 2), 16))
                sketch_128 = hard_norm(sk_resize(min_k_down(vice_sketch_1024, 4), 32))
            else:
                sketch_256 = mini_norm(k_resize(min_k_down(sketch_1024, 2), 16))
                sketch_128 = hard_norm(sk_resize(min_k_down(sketch_1024, 4), 32))
            if debugging:
                cv2.imwrite(room_path + '/sketch.128.jpg', sketch_128)
                cv2.imwrite(room_path + '/sketch.256.jpg', sketch_256)

            print('generating 1st draft (baby)... (2/4)')
            baby = go_baby(sketch_128, opreate_normal_hint(ini_hint(sketch_128), points, type=0, length=1))
            baby = de_line(baby, sketch_128)
            for _ in range(16):
                baby = blur_line(baby, sketch_128)
            baby = go_tail(baby)
            baby = clip_15(baby)
            if debugging:
                cv2.imwrite(room_path + '/baby.' + ID + '.jpg', baby)

            print('generating 2nd draft (composition)... (3/4)')
            composition = go_gird(sketch=sketch_256, latent=d_resize(baby, sketch_256.shape), hint=ini_hint(sketch_256))
            if line:
                composition = emph_line(composition, d_resize(min_k_down(sketch_1024, 2), composition.shape), lineColor)
            composition = go_tail(composition)
            cv2.imwrite(room_path + '/composition.' + ID + '.jpg', composition)
        else: # draft cache is valid, use cache
            print('Turbo: loading 2nd draft (composition) directly from cache... (3/4)')
            sketch_1024=k_resize(sketch, tweaked_input_resolution)
            composition=cv2.imread(last_composition_path) # read previously generated draft from cache
            cv2.imwrite(room_path + '/composition.' + ID + '.jpg', composition)

        # generate final painting
        painting_function = go_head
        if method == 'rendering':
            painting_function = go_neck
        print('current mode: ' + method)
        print('generating final painting... (4/4)')

        result = painting_function(
            sketch=sketch_1024,
            global_hint=k_resize(composition, 14),
            local_hint=opreate_normal_hint(ini_hint(sketch_1024), points, type=2, length=2),
            global_hint_x=k_resize(reference, 14) if reference is not None else k_resize(composition, 14),
            alpha=(1 - alpha) if reference is not None else 1
        )
        
        if True==(get_enable_super_resolution()):
            print('Image Super-Resolution for the final painting...')
            result = go_tail(result)
            print('Resizing complete.')
        else:
            print('Turbo: Use interpolation algorithm to resize the final painting')
            result = d_resize(result,result.shape,1.5) # resize it to 1.5X using Lanczos interpolation
            print('Resizing complete.')

        cv2.imwrite(room_path + '/result.' + ID + '.jpg', result)
        cv2.imwrite('results/' + room + '.' + ID + '.jpg', result)
        if debugging:
            cv2.imwrite(room_path + '/icon.' + ID + '.jpg', max_resize(result, 128))
        
        print('Colorization complete.')

        # Save draft and draft points to cache
        if True == is_draft_cache_enabled:
            # create a list of current draft points
            draft_points=[]
            for point in points:
                x, y, r, g, b, t = point
                if 0 == t:# type is draft points
                    draft_points.append(point)
            # create cache dir
            os.makedirs(cache_path, exist_ok=True)
            # save current draft points to cache
            with open(last_points_json_path, 'w', encoding='utf-8') as points_json_file:
                json.dump(draft_points, points_json_file)
            # save draft (composition) to cache
            cv2.imwrite(last_composition_path, composition)
            print('Draft cached.')
    return


@route('/upload_sketch', method='POST')
def upload_sketch():
    room = request.forms.get("room")
    previous_step = request.forms.get("step")
    if previous_step == 'sample':
        new_room_id = datetime.datetime.now().strftime('%b%dH%HM%MS%S') + 'R' + str(np.random.randint(100, 999))
        shutil.copytree('game/samples/' + room, 'game/rooms/' + new_room_id)
        print('copy ' + 'game/samples/' + room + ' to ' + 'game/rooms/' + new_room_id)
        room = new_room_id
    ID = datetime.datetime.now().strftime('H%HM%MS%S')
    method = request.forms.get("method")
    if room == 'new':
        room = datetime.datetime.now().strftime('%b%dH%HM%MS%S') + 'R' + str(np.random.randint(100, 999))
        room_path = 'game/rooms/' + room
        os.makedirs(room_path, exist_ok=True)
        sketch = from_png_to_jpg(get_request_image('sketch'))
        cv2.imwrite(room_path + '/sketch.original.jpg', sketch)
        print('original_sketch saved')
    else:
        room_path = 'game/rooms/' + room
        sketch = cv2.imread(room_path + '/sketch.original.jpg')
    print('sketch upload pool get request: ' + method)
    sketch_upload_pool.append((room, sketch, method))
    while True:
        time.sleep(0.1)
        if os.path.exists(room_path + '/sketch.' + method + '.jpg'):
            break
    time.sleep(1.0)
    return room + '_' + ID


@route('/request_result', method='POST')
def request_result():
    room = request.forms.get("room")
    previous_step = request.forms.get("step")
    if previous_step == 'sample':
        new_room_id = datetime.datetime.now().strftime('%b%dH%HM%MS%S') + 'R' + str(np.random.randint(100, 999))
        shutil.copytree('game/samples/' + room, 'game/rooms/' + new_room_id)
        print('copy ' + 'game/samples/' + room + ' to ' + 'game/rooms/' + new_room_id)
        room = new_room_id
    ID = datetime.datetime.now().strftime('H%HM%MS%S')
    room_path = 'game/rooms/' + room
    options_str = request.forms.get("options")
    
    # save color hint
    with open(room_path + '/options.' + ID + '.json', 'w') as f:
        f.write(options_str)

    options = json.loads(options_str)
    method = options["method"]
    sketch = cv2.imread(room_path + '/sketch.' + method + '.jpg', cv2.IMREAD_GRAYSCALE)
    alpha = float(options["alpha"])
    points = options["points"]
    for _ in range(len(points)):
        points[_][1] = 1 - points[_][1]
    if options["hasReference"]:
        reference = from_png_to_jpg(get_request_image('reference'))
        cv2.imwrite(room_path + '/reference.' + ID + '.jpg', reference)
        reference = s_enhance(reference)
    else:
        reference = None
    print('request result room = ' + str(room) + ', ID = ' + str(ID))
    lineColor = np.array(options["lineColor"])
    line = options["line"]
    painting_pool.append([room, ID, sketch, alpha, reference, points, method, lineColor, line])
    while True:
        time.sleep(0.1)
        if os.path.exists(room_path + '/result.' + ID + '.jpg'):
            break
    time.sleep(1.0)
    return room + '_' + ID


@route('/get_sample_list', method='POST')
def get_sample_list():
    all_names = []
    for (root, dirs, files) in os.walk("game/samples"):
        all_names = dirs
        break
    all_names.sort()
    result = json.dumps(all_names)
    return result


@route('/save_as_sample', method='POST')
def save_as_sample():
    room = request.forms.get("room")
    step = request.forms.get("step")
    previous_path = 'game/rooms/' + room
    new_path = 'game/samples/' + room
    os.makedirs(new_path, exist_ok=True)

    def transfer(previous_file_name, new_file_name=None):
        if new_file_name is None:
            new_file_name = previous_file_name
        if os.path.exists(previous_path + '/' + previous_file_name):
            shutil.copy(previous_path + '/' + previous_file_name, new_path + '/' + new_file_name)

    transfer('sketch.original.jpg')
    transfer('sketch.improved.jpg')
    transfer('sketch.colorization.jpg')
    transfer('sketch.rendering.jpg')
    transfer('sketch.recolorization.jpg')
    transfer('sketch.de_painting.jpg')

    transfer('result.' + step + '.jpg', 'result.sample.jpg')
    transfer('reference.' + step + '.jpg', 'reference.sample.jpg')
    transfer('icon.' + step + '.jpg', 'icon.sample.jpg')
    transfer('composition.' + step + '.jpg', 'composition.sample.jpg')
    transfer('options.' + step + '.json', 'options.sample.json')

    print('saved')

    return 'ok'


def server_loop():
    while True:
        time.sleep(0.173)
        try:
            handle_sketch_upload_pool()
            handle_painting_pool()
        except Exception as e:
            print(e)


os.makedirs('game/rooms', exist_ok=True)
os.makedirs('results', exist_ok=True)
threading.Thread(target=server_loop).start()

if multiple_process:
    run(host="0.0.0.0", port=8232, server='paste')
else:
    run(host="0.0.0.0", port=8000, server='paste')

