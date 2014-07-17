import json
from BeautifulSoup import BeautifulStoneSoup 

path = "data/xmls"
# path = "../data/xmls"

def read_regions():
    regions_dict = dict()
    regions_bases = dict()
    regions_events = dict()
    with open(path + "/regions.xml", mode='r') as file:
        handle = BeautifulStoneSoup(file.read())
        for region in handle.findAll("region"):
            key = eval(region.find("id").text)
            value = str(region.find("name").text)
            regions_dict[key] = value

            # find all bases
            base_list = list()
            for base in region.findAll("base"):
                base_list.append({ "key" : str(base.text), \
                                   "active" : bool(int(base['active'])), \
                                   "x" : eval(base['x']), \
                                   "y" : eval(base['y'])  })
            regions_bases[key] = base_list

    return regions_dict, regions_bases

def read_bases():
    bases_dict = dict()
    with open(path + "/bases.xml", mode='r') as file:
        handle = BeautifulStoneSoup(file.read())
        for region in handle.findAll("base"):
            key = str(region.find("key").text)
            value = str(region.find("title").text)
            bases_dict[key] = value
    return bases_dict

def read_upgrades():
    upgrades_dict = dict()
    with open(path + "/upgrades.xml", mode='r') as file:
        handle = BeautifulStoneSoup(file.read())
        for region in handle.findAll("upgrade"):
            key = str(region.find("key").text)
            value = str(region.find("title").text)
            upgrades_dict[key] = value
    return upgrades_dict

def read_events():
    events_dict = dict()
    with open(path + "/events.xml", mode='r') as file:
        handle = BeautifulStoneSoup(file.read())
        for region in handle.findAll("event"):
            key = str(region.find("key").text)
            value = str(region.find("title").text)
            events_dict[key] = value
    return events_dict


if __name__ == '__main__':
    regions_dict, regions_bases = read_regions()
    bases_dict = read_bases()
    upgrades_dict = read_upgrades()
    events_dict = read_events()

    nodes_dict = dict()
    nodes_dict.update(bases_dict)
    nodes_dict.update(upgrades_dict)
    nodes_dict.update(events_dict)

    mappings = { 'regions_dict' : regions_dict, \
                 'events_dict' : events_dict, \
                 'bases_dict' : bases_dict, \
                 'upgrades_dict' : upgrades_dict, \
                 'nodes_dict' : nodes_dict, \
                 'regions_bases' : regions_bases }

    print json.dumps(mappings)
