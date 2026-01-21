
import { MenuItem, DealItem } from './types';

export const COLORS = {
  red: '#8b0000',
  orange: '#f37021',
  dark: '#121212',
};

export const MENU_DATA: { [key: string]: MenuItem[] } = {
  "Starter": [
    {id: "s1", name: "Plain Fries", price: {Reg: 230, Large: 300}, category: "Starter"}, 
    {id: "s2", name: "Loaded Fries", price: 599, category: "Starter"}, 
    {id: "s3", name: "Pizza Fries", price: 720, category: "Starter"},
    {id: "s4", name: "Dragon Shots", price: 399, category: "Starter"}, 
    {id: "s5", name: "Oven Baked Wings", price: {Reg: 399, Large: 780}, category: "Starter"},
    {id: "s6", name: "Peri-Peri Wings", price: {M: 399, L: 780}, category: "Starter"},
    {id: "s7", name: "Hot Wings", price: {M: 399, L: 780}, category: "Starter"},
    {id: "s8", name: "Honey Chili Wings", price: {M: 449, L: 880}, category: "Starter"},
    {id: "s9", name: "Cheese Sticks", price: 449, category: "Starter"},
    {id: "s10", name: "Meat Sticks", price: 449, category: "Starter"},
    {id: "s11", name: "Nuggets", price: {M: 350, L: 650}, category: "Starter"}
  ],
  "Sandwich": [
    {id: "sd1", name: "Health Harvest", price: 599, category: "Sandwich"}, 
    {id: "sd2", name: "Khameera Sandwich", price: 699, category: "Sandwich"}, 
    {id: "sd3", name: "Club Sandwich", price: 599, category: "Sandwich"}
  ],
  "Fried Burger": [
    {id: "fb1", name: "Chicken Patty Burger", price: 299, category: "Fried Burger"}, 
    {id: "fb2", name: "Zinger Burger", price: 420, category: "Fried Burger"}, 
    {id: "fb3", name: "Mighty Burger", price: 699, category: "Fried Burger"}, 
    {id: "fb4", name: "Chipotle Burger", price: 649, category: "Fried Burger"},
    {id: "fb5", name: "Crispy Jalapeno", price: 549, category: "Fried Burger"},
    {id: "fb6", name: "Stuff Jalapeno", price: 649, category: "Fried Burger"}
  ],
  "Grilled Burger": [
    {id: "gb1", name: "Chicken Grilled", price: 499, category: "Grilled Burger"},
    {id: "gb2", name: "Smokey Grilled", price: 550, category: "Grilled Burger"},
    {id: "gb3", name: "Peri Peri Grilled", price: 749, category: "Grilled Burger"},
    {id: "gb4", name: "Drizzler X", price: 749, category: "Grilled Burger"},
    {id: "gb5", name: "Jalapeno Blaze", price: 749, category: "Grilled Burger"},
    {id: "gb6", name: "Mexi Fiesta", price: 749, category: "Grilled Burger"}
  ],
  "Pan Pizza": [
    {id: "pp1", name: "Chicken Tikka", price: {S:499, M:999, L:1549}, category: "Pan Pizza"}, 
    {id: "pp2", name: "Chicken Fajita", price: {S:499, M:999, L:1549}, category: "Pan Pizza"},
    {id: "pp3", name: "Chicken Supreme", price: {S:499, M:999, L:1549}, category: "Pan Pizza"}, 
    {id: "pp4", name: "Cheese Lover", price: {S:499, M:999, L:1549}, category: "Pan Pizza"},
    {id: "pp5", name: "Veg Lover", price: {S:499, M:999, L:1549}, category: "Pan Pizza"},
    {id: "pp6", name: "Sicilian Pizza", price: {S:499, M:999, L:1549}, category: "Pan Pizza"}
  ],
  "Premium Pizza": [
    {id: "pr1", name: "BBQ Pizza", price: {M:1199, L:1699}, category: "Premium Pizza"},
    {id: "pr2", name: "Creamy Dreamy", price: {M:1199, L:1699}, category: "Premium Pizza"},
    {id: "pr3", name: "OvenX Special", price: {M:1199, L:1699}, category: "Premium Pizza"},
    {id: "pr4", name: "Bonfire Pizza", price: {M:1199, L:1699}, category: "Premium Pizza"}
  ],
  "Deep Dish Pizza": [
    {id: "dd1", name: "Mild Butter", price: {M:1749, L:2449}, category: "Deep Dish Pizza"}, 
    {id: "dd2", name: "OvenX Special", price: {M:1749, L:2449}, category: "Deep Dish Pizza"}
  ],
  "Extreme Pizza": [
    {id: "ex1", name: "Extreme Peri Peri", price: {M:1499, L:2049}, category: "Extreme Pizza"}, 
    {id: "ex2", name: "Extreme Flaming Kabab", price: {M:1499, L:2049}, category: "Extreme Pizza"},
    {id: "ex3", name: "Crispy Extreme", price: {M:1499, L:2049}, category: "Extreme Pizza"}
  ],
  "Craft My Own Pizza": [
    {id: "cm1", name: "Kabab Crust", price: {Med: 1399, Large: 1799}, category: "Craft My Own Pizza"},
    {id: "cm2", name: "Crown Crust", price: {Med: 1399, Large: 1799}, category: "Craft My Own Pizza"},
    {id: "cm3", name: "Cheese Crust", price: {Med: 1399, Large: 1799}, category: "Craft My Own Pizza"},
    {id: "cm4", name: "Crusti Thin", price: 1699, category: "Craft My Own Pizza"}
  ],
  "Platters": [
    {id: "pl1", name: "Khameera Sandwich Platter", price: 699, category: "Platters"},
    {id: "pl2", name: "Calzone Platter", price: 899, category: "Platters"},
    {id: "pl3", name: "Behari Platter", price: 949, category: "Platters"}
  ],
  "Pasta": [
    {id: "pa1", name: "Alfredo Pasta", price: 699, category: "Pasta"}, 
    {id: "pa2", name: "OvenX Flaming Pasta", price: 650, category: "Pasta"},
    {id: "pa3", name: "Fire Kissed Pasta", price: 699, category: "Pasta"}, 
    {id: "pa4", name: "X-Special Pasta", price: 749, category: "Pasta"}
  ],
  "Wraps & Rolls": [
    {id: "wr1", name: "Chipotle Wrap", price: 699, category: "Wraps & Rolls"}, 
    {id: "wr2", name: "BBQ Wrap", price: 599, category: "Wraps & Rolls"},
    {id: "wr3", name: "Donar Kabab", price: 749, category: "Wraps & Rolls"},
    {id: "wr4", name: "Crunch Wrap", price: 449, category: "Wraps & Rolls"},
    {id: "wr5", name: "Zingeratha Roll", price: 449, category: "Wraps & Rolls"}, 
    {id: "wr6", name: "Paratha Roll", price: 449, category: "Wraps & Rolls"},
    {id: "wr7", name: "Malai Roll", price: 449, category: "Wraps & Rolls"}, 
    {id: "wr8", name: "Behari Roll", price: 749, category: "Wraps & Rolls"},
    {id: "wr9", name: "Peri Peri Wrap", price: 749, category: "Wraps & Rolls"}
  ],
  "Bar Menu (Beverages)": [
    {id: "bm1", name: "Coke Buddy", price: 130, category: "Bar Menu (Beverages)"}, 
    {id: "bm2", name: "Sprite Buddy", price: 130, category: "Bar Menu (Beverages)"}, 
    {id: "bm3", name: "Coke 1 Liter", price: 190, category: "Bar Menu (Beverages)"},
    {id: "bm4", name: "Next Cola 1 Liter", price: 170, category: "Bar Menu (Beverages)"},
    {id: "bm5", name: "Coke 1.5L", price: 230, category: "Bar Menu (Beverages)"}, 
    {id: "bm6", name: "Sprite 1.5L", price: 230, category: "Bar Menu (Beverages)"},
    {id: "bm7", name: "Water Small", price: 99, category: "Bar Menu (Beverages)"},
    {id: "bm8", name: "Water Large", price: 170, category: "Bar Menu (Beverages)"}
  ]
};

export const DEALS_DATA: DealItem[] = [
  { id: "d1", name: "Midnight Deal 1", desc: "2x Med Extreme Pizzas + 1.5L Drink", price: 2699, badge: "HOT DEAL", img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&h=400", flavorsNeeded: [{label: "Pizza 1", cat: "Extreme Pizza"}, {label: "Pizza 2", cat: "Extreme Pizza"}], fixedItems: ["1.5L Soft Drink"] },
  { id: "d2", name: "Midnight Deal 2", desc: "1x Large wings + 2x Large Pan Pizzas + 1.5L Drink", price: 3249, badge: "SAVER", img: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&h=400", flavorsNeeded: [{label: "Pizza 1", cat: "Pan Pizza"}, {label: "Pizza 2", cat: "Pan Pizza"}], fixedItems: ["1x Large Hot Wings", "1.5L Soft Drink"] },
  { id: "d3", name: "Midnight Deal 3", desc: "1x Large wings + 2x Large Premium Pizzas + 1.5L Drink", price: 3649, badge: "PREMIUM", img: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&h=400", flavorsNeeded: [{label: "Pizza 1", cat: "Premium Pizza"}, {label: "Pizza 2", cat: "Premium Pizza"}], fixedItems: ["1x Large Hot Wings", "1.5L Soft Drink"] },
  { id: "d4", name: "Midnight Deal 4", desc: "1x Med Extreme Pizza + 1x Large Extreme Pizza + 1.5L Drink", price: 3149, badge: "MIX DEAL", img: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&h=400", flavorsNeeded: [{label: "Medium Pizza", cat: "Extreme Pizza"}, {label: "Large Pizza", cat: "Extreme Pizza"}], fixedItems: ["1.5L Soft Drink"] },
  { id: "d5", name: "Family Feast", desc: "2 Med Pizzas + 2 Zingers + 1L Drink + 6 Wings", price: 2299, badge: "FAMILY", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&h=400", flavorsNeeded: [{label: "Pizza 1", cat: "Pan/Premium"}, {label: "Pizza 2", cat: "Pan/Premium"}], fixedItems: ["2x Zinger Burgers", "1L Drink", "6x Wings"] },
  { id: "d6", name: "Extreme Buddy", desc: "1 Medium Extreme Pizza + Free 1L Drink", price: 1449, badge: "BEST SELLER", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&h=400", flavorsNeeded: [{label: "Pizza Flavor", cat: "Extreme Pizza"}], fixedItems: ["1L Drink"] },
  { id: "d7", name: "Burger Deal 1", desc: "2 Zingers + 1 Reg Fries + 2 Drinks", price: 999, badge: "HOT", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&h=400", fixedItems: ["2x Zinger Burgers", "1x Regular Fries", "2x Drinks"] },
  { id: "d8", name: "Burger Deal 2", desc: "1 Zinger + 1 Reg Fries + 1 345ml Drink + 2 Wings", price: 990, badge: "SNACK", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&h=400", fixedItems: ["1x Zinger Burger", "1x Regular Fries", "1x 345ml Buddy Drink", "2x Pcs Wings"] },
  { id: "d9", name: "Burger Deal 3", desc: "4 Classic Zingers + 2 Reg Fries + 1L Drink + 6 Wings", price: 1990, badge: "PARTY", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&h=400", fixedItems: ["4x Classic Zinger Burgers", "2x Regular Fries", "1x 1 Liter Drink", "6x Pcs Wings"] },
  { id: "d10", name: "01 PIZZA DEAL", desc: "1 Large Pizza (Pan) + 1L Drink", price: 1299, badge: "PAN", img: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?auto=format&fit=crop&w=600&h=400", flavorsNeeded: [{label: "Pizza", cat: "Pan Pizza"}], fixedItems: ["1L Drink"] },
  { id: "d11", name: "02 PIZZA DEAL", desc: "1 Large Pizza (Premium) + 1L Drink", price: 1499, badge: "PREMIUM", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&h=400", flavorsNeeded: [{label: "Pizza", cat: "Premium Pizza"}], fixedItems: ["1L Drink"] },
  { id: "d12", name: "03 PIZZA DEAL", desc: "1 Large Crown Pizza + 1L Drink", price: 1599, badge: "CROWN", img: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&h=400", flavorsNeeded: [{label: "Crown Flavor", cat: "Craft My Own Pizza"}], fixedItems: ["1L Drink"] },
  { id: "d13", name: "04 PIZZA DEAL", desc: "1 Large Extreme Pizza + 1L Drink", price: 1999, badge: "EXTREME", img: "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=600&h=400", flavorsNeeded: [{label: "Extreme Flavor", cat: "Extreme Pizza"}], fixedItems: ["1L Drink"] }
];
