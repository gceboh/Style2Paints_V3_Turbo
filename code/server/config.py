device_A = '/gpu:0'
device_B = '/gpu:0'
multiple_process = True
debugging = False

# tweak_input_resolution_factor=1 # default input sketch size (short edge=1024px), used by official version
tweak_input_resolution_factor=0.5 # Scale the input sketch to 50% (0.5) of the default size (short edge=512px)
