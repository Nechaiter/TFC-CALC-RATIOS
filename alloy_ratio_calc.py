import pandas as pd
import math
#https://www.desmos.com/calculator/x55yoxhrbt

data_denominator = []

max_vessel=3024
max_items=64

greater_mineral=[144,36,16]
lesser_mineral=[129,31,13]

greater_mineral_bounds=(70,80)
lesser_mineral_bounds=(20,30)

greater_mineral_items=[0,0,0]
lesser_mineral_items=[0,0,0]

ml_to_ingots=144

for index in range(len(greater_mineral)):
    item_count=math.ceil(max_vessel/greater_mineral[index])
    if item_count<64:
        greater_mineral_items[index]=item_count
    else:
        greater_mineral_items[index]=max_items

    max_ml=greater_mineral_items[index]*greater_mineral[index]
    if (max_ml*100)/max_vessel > greater_mineral_bounds[1]:
        max_ml=max_vessel/greater_mineral[index]
        upper_bound_ml=max_vessel*greater_mineral_bounds[1]/100
        if max_ml > upper_bound_ml:
            greater_mineral_items[index]=math.ceil(upper_bound_ml/greater_mineral[index])

for index in range(len(lesser_mineral)):
    item_count=math.ceil(max_vessel/lesser_mineral[index])
    if item_count<64:
        lesser_mineral_items[index]=item_count
    else:
        lesser_mineral_items[index]=max_items

    max_ml=lesser_mineral_items[index]*lesser_mineral[index]
    if (max_ml*100)/max_vessel > lesser_mineral_bounds[1]:
        max_ml=max_vessel/lesser_mineral[index]
        upper_bound_ml=max_vessel*lesser_mineral_bounds[1]/100
        if max_ml > upper_bound_ml:
            lesser_mineral_items[index]=math.ceil(upper_bound_ml/lesser_mineral[index])





print(greater_mineral_items)
print(lesser_mineral_items)

for d in range(greater_mineral_items[0]):
    for e in range(greater_mineral_items[1]):
        for f in range(greater_mineral_items[2]):

            sum_vars = d + e + f
            if sum_vars > max_items:
                continue
            value_X = greater_mineral[0]*d + greater_mineral[1]*e + greater_mineral[2]*f


            current_percent=value_X*100/max_vessel

            if current_percent>greater_mineral_bounds[1]:
                continue
            slots=int(d > 0) + int(e > 0) + int(f > 0)

            data_denominator.append((d, e, f, sum_vars,slots, value_X))

# Convertimos a tabla
df_denominator = pd.DataFrame(data_denominator, columns=['d', 'e', 'f', 'sum_def','slots', 'X'])
df_denominator = df_denominator[df_denominator['X'] > 0]

data_numerador = []


for a in range(lesser_mineral_items[0]):
    for b in range(lesser_mineral_items[1]):
        for c in range(lesser_mineral_items[2]):
            sum_vars = a + b + c
            if sum_vars > max_items:
                continue
            value_Y = lesser_mineral[0]*a + lesser_mineral[1]*b + lesser_mineral[2]*c
            current_percent=value_Y*100/max_vessel

            if current_percent>lesser_mineral_bounds[1]:
                continue
            slots=int(a > 0) + int(b > 0) + int(c > 0)
            data_numerador.append((a, b, c, sum_vars,slots, value_Y))

df_numerador = pd.DataFrame(data_numerador, columns=['a', 'b', 'c', 'sum_abc','slots', 'Y'])
df_numerador = df_numerador[df_numerador['Y'] > 0]

solutions = []

print(len(df_denominator))
print(len(df_numerador))
for index, row_numera in df_numerador.iterrows():
    Y = row_numera['Y']
    max_X = (80/20)*Y
    min_X = (70/30)*Y
    
    valid_combinations = df_denominator[
        (df_denominator['X'] >= min_X) & 
        (df_denominator['X'] <= max_X) & 
        #(df_denominador['X']+Y>=ml_to_ingots) & 
        ((df_denominator['X']+Y)%ml_to_ingots==0) & 
        (df_denominator['X']+Y<=max_vessel) &
        (df_denominator['slots']+row_numera['slots']<=4)
        ]
    
    for idx, row_denom in valid_combinations.iterrows():
        total_item_sum = row_denom['sum_def'] + row_numera['sum_abc']
        weighted_sum = row_denom['X'] + Y
        
        if total_item_sum <= 64 and weighted_sum <= 3024:
            solutions.append({
                'a': row_numera['a'], 'b': row_numera['b'], 'c': row_numera['c'],
                'd': row_denom['d'], 'e': row_denom['e'], 'f': row_denom['f'],
                'X': row_denom['X'], 'Y': Y,
                'Sum_Total': total_item_sum,
                'Sum_ml':row_denom['X']+Y,
                'slots_usage':row_denom['slots']+row_numera['slots']
            })

# Resultado final
df_final = pd.DataFrame(solutions)
print(f"{len(df_final)} solutions!")
print(df_final.head())
df_final.to_csv('alloy sol tables/sol_least_items_144.csv')