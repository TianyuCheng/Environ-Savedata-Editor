from struct import unpack, calcsize

def read_content(fmt, fileContent):
    size = calcsize(fmt)
    return unpack(fmt, fileContent[:size])[0], fileContent[size:]

handle = open('test.dat', 'rb')
content = handle.read()
handle.close()

magic, content = read_content('i', content)
print magic 

time, content = read_content('f', content)
print time

pc, content = read_content('d', content)
print pc

funds, content = read_content('d', content)
print funds

region_counts, content = read_content('i', content)
print region_counts
