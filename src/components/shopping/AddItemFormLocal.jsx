import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

const SECTIONS = [
  { value: 'produce', label: 'Produce' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'meat_seafood', label: 'Meat & Seafood' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'frozen', label: 'Frozen' },
  { value: 'pantry', label: 'Pantry' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'household', label: 'Household' },
  { value: 'personal_care', label: 'Personal Care' },
  { value: 'other', label: 'Other' },
];

const CATEGORIES = [
  { value: 'dairy', label: 'Dairy' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'meat', label: 'Meat' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'frozen', label: 'Frozen' },
  { value: 'canned', label: 'Canned' },
  { value: 'spices', label: 'Spices' },
  { value: 'other', label: 'Other' },
];

export default function AddItemFormLocal({ shoppingListId, onItemAdded }) {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [category, setCategory] = useState('other');
  const [section, setSection] = useState('other');
  const [notes, setNotes] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    onItemAdded({
      shopping_list_id: shoppingListId,
      name: itemName,
      quantity: quantity,
      unit: unit,
      category: category,
      section: section,
      notes: notes || undefined,
      checked: false
    });
    
    setItemName('');
    setQuantity(1);
    setUnit('pcs');
    setCategory('other');
    setSection('other');
    setNotes('');
    setShowAdvanced(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-slate-50 p-4 rounded-xl">
      <div className="flex gap-2">
        <Input
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Add an item..."
          className="flex-1 bg-white"
        />
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseFloat(e.target.value))}
          className="w-20 bg-white"
          min="0"
          step="0.1"
        />
        <Input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-20 bg-white"
          placeholder="unit"
        />
        <Button type="submit" disabled={!itemName.trim()} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs text-slate-600 hover:text-slate-800"
      >
        {showAdvanced ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
        {showAdvanced ? 'Hide' : 'Show'} details
      </Button>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Store Section</label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SECTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-600 mb-1 block">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Brand preference, organic, etc."
              className="bg-white resize-none h-20"
            />
          </div>
        </div>
      )}
    </form>
  );
}