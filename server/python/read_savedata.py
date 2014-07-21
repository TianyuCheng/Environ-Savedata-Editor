import sys
import json
from struct import unpack, calcsize

MAGIC = 1989127302

def read_content(fmt, fileContent):
    size = calcsize(fmt)
    return unpack(fmt, fileContent[:size])[0], fileContent[size:]

def read_contents(fmt, fileContent):
    size = calcsize(fmt)
    return unpack(fmt, fileContent[:size]), fileContent[size:]

def read_header(fileContent):
    """ format:
        i - Magic Number    int32
        f   - time
        d - Political Cap   double
        d - Funds           double
        i - numRegions      int32
    """
    # filetype check
    magic_number, fileContent = read_content("i", fileContent)
    assert magic_number == MAGIC, "Magic number corrupted"

    ret = dict()
    ret['time'], fileContent = read_content("f", fileContent)
    ret['political_capital'], fileContent = read_content("d", fileContent)
    ret['funds'], fileContent = read_content("d", fileContent)
    ret['region_counts'], fileContent = read_content("i", fileContent)

    ret['time'] = round(ret['time'], 2)
    ret['political_capital'] = round(ret['political_capital'], 2)
    ret['funds'] = round(ret['funds'], 2)
    # print json.dumps(ret)
    return ret, fileContent

def read_region(fileContent):
    region_id, fileContent = read_content("i", fileContent)
    region_active, fileContent = read_content("?", fileContent)

    # read scores
    scores  = ['FUNDS', 'PC', 'EC', 'EN', 'CO2', 'AP', 'WP', 'LP', 'GDP', 'EQ', 'PP', 'TECH', 'GREEN', 'DONATION']
    numbers, fileContent = read_contents("14f", fileContent)
    numbers = map(lambda x : round(x, 2), numbers)
    scores = dict(zip(scores, numbers))
    # print scores

    # read history nodes
    history = dict()
    num_nodes_in_history, fileContent = read_content("i", fileContent)
    assert num_nodes_in_history < 200, "too many nodes"
    for index in xrange(num_nodes_in_history):
        key, fileContent = read_content("10s", fileContent)
        activated_time, fileContent = read_content("f", fileContent)
        # print key.strip(), activated_time
        # history[key.strip()] = round(activated_time, 2)
        history[round(activated_time, 2)] = key.strip()

    ret = { 'id' : region_id, 'active' : region_active, 'scores' : scores, 'history' : history }
    # print json.dumps(ret)
    return ret, fileContent

if __name__ == '__main__':
    # info = read_xml()
    info = dict()
    regions = list()
    with open(sys.argv[1], mode='rb') as file: # b is important -> binary
    # with open("../data/savedata.dat", mode='rb') as file: # b is important -> binary
    # with open("../../testdata.dat", mode='rb') as file: # b is important -> binary
        fileContent = file.read()
        header, fileContent = read_header(fileContent)
        info.update(header)

        for index in xrange(info['region_counts']):
            region, fileContent = read_region(fileContent)
            regions.append(region)
    
    info['regions'] = regions
    print json.dumps(info, sort_keys=True)
