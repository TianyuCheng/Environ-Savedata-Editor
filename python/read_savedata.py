import json
from struct import unpack 
import sys

MAGIC = 1989127302

def read_header(fileContent):
    """ format:
        i - Magic Number    int32
       # i   - time
        d - Political Cap   double
        d - Funds           double
        i - numRegions      int32
    """
    # filetype check
    magic_number = unpack("i", fileContent[:4])[0]
    assert magic_number == MAGIC, "Magic number corrupted"

    ret = dict()
    ret['political_capital'] = unpack("d", fileContent[4:12])[0]
    ret['funds'] = unpack("d", fileContent[12:20])[0]
    ret['region_counts'] = unpack("i", fileContent[20:24])[0]

    # print json.dumps(ret)
    return ret

def read_region(fileContent):
    region_id = unpack("i", fileContent[:4])[0]
    region_active = unpack("?", fileContent[4:5])[0]

    scores  = ['EC', 'EN', 'CO2', 'AP', 'WP', 'LP', 'GDP', 'EQ', 'PP', 'TECH', 'GREEN', 'DONATION']
    numbers = unpack("ffffffffffff", fileContent[13:61])
    scores = dict(zip(scores, numbers))

    ret = { 'id' : region_id, 'active' : region_active, 'scores' : scores}
    # print json.dumps(ret)
    return ret

if __name__ == '__main__':
    info = dict()
    regions = list()
    with open(sys.argv[1], mode='rb') as file: # b is important -> binary
    # with open("savedata.dat", mode='rb') as file: # b is important -> binary
        fileContent = file.read()
        info.update(read_header(fileContent))
        fileContent = fileContent[24:]
        
        for index in xrange(info['region_counts']):
            regions.append(read_region(fileContent))
            fileContent = fileContent[61:]

    info['regions'] = regions
    print json.dumps(info)
