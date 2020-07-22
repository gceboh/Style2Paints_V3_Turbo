import configparser

# get ini config parser
ini_config = configparser.ConfigParser()
ini_path = 'config.ini'

# device_A = '/gpu:0'
# device_B = '/gpu:0'
device_A = '/cpu:0'
device_B = '/cpu:0'
multiple_process = True
debugging = False
is_draft_cache_enabled=True # enable draft cache for acceleration


# load "zoom factor" from ini config file
def get_sketch_resolution_factor():
    ini_config.read(ini_path) # read ini config
    resolution_factor = ini_config.getfloat('general','sketch_zoom_factor')
    return resolution_factor
    
# load "enable_super_resolution" from ini config file
def get_enable_super_resolution():
    ini_config.read(ini_path) # read ini config
    enable_super_resolution = ini_config.getboolean('general','enable_super_resolution')
    return enable_super_resolution