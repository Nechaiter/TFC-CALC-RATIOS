import pandas as pd
import math
import itertools
#https://www.desmos.com/calculator/hmbsmocu3p
data = []


max_items=48
iron_mls=[129,31,13]
coal_coverage=144


for a,b,c in itertools.product(range(max_items),repeat=3):
    sum_items=a+b+c
    if sum_items>=max_items:
        continue
    iron_content = iron_mls[0]*a + iron_mls[1]*b + iron_mls[2]*c
    if iron_content%coal_coverage>0:
        #its a loss
        continue
    if iron_content//((max_items-sum_items)*coal_coverage)>1:
        # its doesn't make sense to put high mount of iron if you only are throwing 1 item of coal...
        # Only want ratios where loss is between 0 and the coal coverage (144)
        continue
    coal_needed=iron_content/coal_coverage
    if sum_items+coal_needed>max_items:
        continue

    data.append((a,b,c,sum_items,coal_needed,coal_needed))
    
    
        
df = pd.DataFrame(data, columns=['a', 'b', 'c', 'weighted_iron_sum(X)','coal_count(Y)', 'Ingots'])



print(f"{len(df)} solutions!")
print(df.head())
df.to_csv('Bloomery table/bloomery.csv')

