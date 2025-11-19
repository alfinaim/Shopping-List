import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import AddItemFormLocal from './AddItemFormLocal';
import ShoppingItemRowLocal from './ShoppingItemRowLocal';
import { AnimatePresence } from "framer-motion";
import { ShoppingCart, Store, Maximize2 } from 'lucide-react';
import { createShoppingItem, updateShoppingItem, deleteShoppingItem } from '../shopping/localStorage';

export default function ListDetailModalLocal({ list, items, open, onClose, onUpdate }) {
  const [shoppingMode, setShoppingMode] = useState(false);
  const handleItemAdded = (itemData) => {
    createShoppingItem(itemData);
    onUpdate();
  };

  const handleUpdateItem = (id, data) => {
    updateShoppingItem(id, data);
    onUpdate();
  };

  const handleDeleteItem = (id) => {
    deleteShoppingItem(id);
    onUpdate();
  };

  const uncheckedItems = items.filter(item => !item.checked);
  const checkedItems = items.filter(item => item.checked);

  // Group items by section
  const groupBySection = (itemsList) => {
    const sections = {};
    itemsList.forEach(item => {
      const section = item.section || 'other';
      if (!sections[section]) {
        sections[section] = [];
      }
      sections[section].push(item);
    });
    return sections;
  };

  const sectionLabels = {
    produce: 'Produce',
    dairy: 'Dairy',
    meat_seafood: 'Meat & Seafood',
    bakery: 'Bakery',
    frozen: 'Frozen',
    pantry: 'Pantry',
    beverages: 'Beverages',
    snacks: 'Snacks',
    household: 'Household',
    personal_care: 'Personal Care',
    other: 'Other'
  };

  const uncheckedBySection = groupBySection(uncheckedItems);
  const checkedBySection = groupBySection(checkedItems);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`${shoppingMode ? 'max-w-4xl' : 'max-w-2xl'} max-h-[85vh] overflow-hidden flex flex-col bg-white`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className={`${shoppingMode ? 'text-3xl' : 'text-2xl'} font-bold flex items-center gap-3`}>
              <div className={`${shoppingMode ? 'h-12 w-12' : 'h-10 w-10'} rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center`}>
                <ShoppingCart className={`${shoppingMode ? 'h-7 w-7' : 'h-5 w-5'} text-white`} />
              </div>
              {list?.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Switch
                id="shopping-mode"
                checked={shoppingMode}
                onCheckedChange={setShoppingMode}
              />
              <Label htmlFor="shopping-mode" className="text-sm">
                <Maximize2 className="h-4 w-4" />
              </Label>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto">
          {!shoppingMode && (
            <div className="sticky top-0 bg-white pt-2 pb-4 z-10">
              <AddItemFormLocal 
                shoppingListId={list?.id} 
                onItemAdded={handleItemAdded}
              />
            </div>
          )}

          {uncheckedItems.length === 0 && checkedItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShoppingCart className={`${shoppingMode ? 'h-16 w-16' : 'h-12 w-12'} mx-auto mb-3 opacity-50`} />
              <p className={shoppingMode ? 'text-xl' : ''}>No items yet. Start adding to your list!</p>
            </div>
          ) : (
            <>
              {uncheckedItems.length > 0 && (
                <div className="space-y-4">
                  <h3 className={`${shoppingMode ? 'text-2xl' : 'text-lg'} font-bold text-slate-800 px-3 flex items-center gap-2`}>
                    <Store className={`${shoppingMode ? 'h-7 w-7' : 'h-5 w-5'} text-emerald-600`} />
                    Shopping List
                  </h3>
                  {Object.entries(uncheckedBySection).map(([section, sectionItems]) => (
                    <div key={section} className="space-y-2">
                      <div className={`px-3 ${shoppingMode ? 'py-2.5' : 'py-1.5'} bg-slate-100 rounded-lg`}>
                        <h4 className={`${shoppingMode ? 'text-base' : 'text-sm'} font-semibold text-slate-700`}>
                          {sectionLabels[section]}
                        </h4>
                      </div>
                      <AnimatePresence>
                        {sectionItems.map((item) => (
                          <ShoppingItemRowLocal
                            key={item.id}
                            item={item}
                            onUpdate={handleUpdateItem}
                            onDelete={handleDeleteItem}
                            shoppingMode={shoppingMode}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}

              {checkedItems.length > 0 && !shoppingMode && (
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-sm font-semibold text-slate-600 px-3">Purchased</h3>
                  {Object.entries(checkedBySection).map(([section, sectionItems]) => (
                    <div key={section} className="space-y-2">
                      <AnimatePresence>
                        {sectionItems.map((item) => (
                          <ShoppingItemRowLocal
                            key={item.id}
                            item={item}
                            onUpdate={handleUpdateItem}
                            onDelete={handleDeleteItem}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}