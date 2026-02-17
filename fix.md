# TerraFirmaCraft: Early Game Efficiency Ratios

This guide explains how to calculate and apply optimal ratios for early-game mechanics in TerraFirmaCraft (TFC), focusing on Alloy Vessels and Bloomery efficiency.

## 1. Alloy Ratios in Vessels

[Interactive Graph: Desmos Calculator](https://www.desmos.com/calculator/x55yoxhrbt)

A vessel has a hard capacity limit of **3024 mB**. To create valid alloys, we must ensure that the total volume of metal does not exceed this limit and that the proportions of each metal respect the specific alloy recipe.

### Example: Brass Alloy
To create Brass, we mix Copper ($x$) and Zinc ($y$). The sum of these metals (in mB) must fit within the vessel's capacity:

$$x + y \le 3024 \quad \{x > 0, y > 0\}$$

![Brass Capacity Constraints](https://github.com/Nechaiter/Semi-Guide-TFC-Early-Game-Ratios/blob/main/images/Pasted_image_20260202033806.png?raw=true)

### Alloy Bounds
Every alloy has a lower and upper bound for its components. For Brass, the required ratio is **20–30% Zinc** and **70–80% Copper**. This creates a validity zone defined by two linear equations:

**Upper Bound (30% Zinc):**
$$y = \frac{30}{70}x \quad \{x > 0\}$$

**Lower Bound (20% Zinc):**
$$y = \frac{20}{80}x \quad \{x > 0\}$$

![Brass Alloy Bounds](https://github.com/Nechaiter/Semi-Guide-TFC-Early-Game-Ratios/blob/main/images/Pasted_image_20260202034123.png?raw=true)

### Optimizing Ore Combinations
Ores come in three sizes, each providing a specific amount of metal. Let $a, b, c$ (for Zinc) and $d, g, f$ (for Copper) represent the count of each ore size:

Some ores contain varying amounts of metal but are classified into the same three categories.
* **Large:** 129 mB
* **Medium:** 31 mB
* **Small:** 13 mB

The total volume for Zinc ($y$) and Copper ($x$) is the weighted sum of these ores:

$$y = 129a + 31b + 13c$$
$$x = 144d + 36g + 16f$$

To produce a valid alloy, the ratio of these sums must fall within the bounds derived earlier:

$$\frac{20}{80} \le \frac{y}{x} \le \frac{30}{70}$$

**Note:** A vessel can store a maximum of **64 items** (4 slots $\times$ 16 items). This constraint significantly reduces the number of valid combinations we need to compute.

### Selecting the Best Ratio
The graph below plots valid combinations. The diagonal lines represent multiples of **144 mB**, which is the amount required to produce a single ingot.

### Note on Graph Accuracy

Some of the points are incorrect, they use more than 4 slots, in the web page is corrected.

![Graph of Valid Points](https://github.com/Nechaiter/Semi-Guide-TFC-Early-Game-Ratios/blob/main/images/Pasted_image_20260202040116.png?raw=true)

* **Zinc-Rich:** Select points closer to the purple line.
* **Copper-Rich:** Select points closer to the green line.

To refine the selection, we categorize points by the diversity of ore sizes used. Minimizing the variety of ore sizes simplifies the amount of crafting.

* **Orange:** Uses 2 ore types.
* **Blue:** Uses 3 ore types.
* **Black:** Uses 4 ore types.

![Granulated Selection](https://github.com/Nechaiter/Semi-Guide-TFC-Early-Game-Ratios/blob/main/images/Pasted_image_20260202041519.png?raw=true)

**Recommendation:** Prioritize points that maximize ingot output while using the fewest ore types (Orange or Blue). For example, the two blue dots on the red line allow for high efficiency:
* Coordinates: $(2160, 864)$ and $(2304, 720)$
* These points vary only in the amount of Zinc dust required.

![Specific Point Selection](https://github.com/Nechaiter/Semi-Guide-TFC-Early-Game-Ratios/blob/main/images/Pasted_image_20260202042435.png?raw=true)

---

## 2. Bloomery: Iron and Charcoal Optimization

[Interactive Graph: Desmos Calculator](https://www.desmos.com/calculator/hmbsmocu3p)

The Bloomery accepts a maximum of **48 items**. Since charcoal is required to smelt the ore, we must balance the amount of iron ore against the charcoal to maximize yield without exceeding the item limit.

### Constraints
Let $x$ be the quantity of Iron Ore items and $y$ be the quantity of Charcoal items. The total item count constraint is:

$$x + y \le 48 \quad \{x > 0, y > 0\}$$

![Bloomery Constraints](https://github.com/Nechaiter/Semi-Guide-TFC-Early-Game-Ratios/blob/main/images/Pasted_image_20260202043201.png?raw=true)

### Avoiding Material Loss
To prevent the loss of molten iron, the input iron (in mB) must be sufficient to produce full ingots (144 mB each) proportional to the charcoal used (1 charcoal creates 1 bloom/ingot).

The efficiency model is defined by:

$$x \ge y$$

Where:
* $x$ is the amount of iron ore.
* $y$ is the amount of charcoal needed.
* The goal is to find a point where the iron provided is equal to or slightly greater than the smelting capacity of the charcoal.

![Efficiency Zone](https://github.com/Nechaiter/Semi-Guide-TFC-Early-Game-Ratios/blob/main/images/Pasted_image_20260202044340.png?raw=true)

### Optimal Configuration
We search for points within the blue zone that satisfy all constraints. The Y-axis represents both the charcoal count and the resulting ingot count.

**Strategy:**
Fortunately, all points represent a weighted sum multiple of 144 , so using any of them will prevent iron loss. To maximize efficiency (maximum ingots, zero loss), simply select the point with the **highest Y value**.

![Optimal Points Graph](https://github.com/Nechaiter/Semi-Guide-TFC-Early-Game-Ratios/blob/main/images/Pasted_image_20260202044658.png?raw=true)

* **Right Side:** These points fill the bloomery's 48-item capacity completely.
* **Left Side:** These points use fewer items overall.

Since a single ore item (129 mB) is not exactly equal to one ingot (144 mB), a 1:1 item ratio is impossible. Therefore, we prioritize the "Top" point of the triangle rather than filling the inventory.

**Best Result:**
The optimal configuration found involves:
* **23** Large Ores (129 mB)
* **1** Medium Ore (31 mB)
* **2** Small Ores (13 mB)

![Final Ratio Calculation](https://github.com/Nechaiter/Semi-Guide-TFC-Early-Game-Ratios/blob/main/images/Pasted_image_20260202050432.png?raw=true)