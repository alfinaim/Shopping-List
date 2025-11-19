import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Trash2, Edit2, Check, X, MessageSquare } from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import { motion } from "framer-motion";

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

export default function ShoppingItemRowLocal({ item, onUpdate, onDelete, shoppingMode = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedQuantity, setEditedQuantity] = useState(item.quantity);
  const [editedUnit, setEditedUnit] = useState(item.unit);
  const [editedCategory, setEditedCategory] = useState(item.category || 'other');
  const [editedSection, setEditedSection] = useState(item.section || 'other');
  const [editedNotes, setEditedNotes] = useState(item.notes || '');

  const handleSave = () => {
    onUpdate(item.id, {
      ...item,
      name: editedName,
      quantity: editedQuantity,
      unit: editedUnit,
      category: editedCategory,
      section: editedSection,
      notes: editedNotes || undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(item.name);
    setEditedQuantity(item.quantity);
    setEditedUnit(item.unit);
    setEditedCategory(item.category || 'other');
    setEditedSection(item.section || 'other');
    setEditedNotes(item.notes || '');
    setIsEditing(false);
  };

  const handleCheck = () => {
    onUpdate(item.id, { ...item, checked: !item.checked });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`group flex flex-col gap-2 ${shoppingMode ? 'p-5' : 'p-3'} rounded-xl hover:bg-slate-50 transition-all ${
        item.checked ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={item.checked}
          onCheckedChange={handleCheck}
          className={`${shoppingMode ? 'h-7 w-7' : 'h-5 w-5'} mt-1`}
        />

        <CategoryIcon category={item.category} size={shoppingMode ? "md" : "sm"} />

        {isEditing && !shoppingMode ? (
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1"
                placeholder="Item name"
              />
              <Input
                type="number"
                value={editedQuantity}
                onChange={(e) => setEditedQuantity(parseFloat(e.target.value))}
                className="w-20"
                min="0"
                step="0.1"
              />
              <Input
                value={editedUnit}
                onChange={(e) => setEditedUnit(e.target.value)}
                className="w-20"
                placeholder="unit"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={editedCategory} onValueChange={setEditedCategory}>
                <SelectTrigger>
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
              <Select value={editedSection} onValueChange={setEditedSection}>
                <SelectTrigger>
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
            <Textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="resize-none h-16"
            />
          </div>
        ) : (
          <div className="flex-1">
            <p className={`font-medium ${shoppingMode ? 'text-xl' : 'text-base'} text-slate-800 ${item.checked ? 'line-through' : ''}`}>
              {item.name}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`${shoppingMode ? 'text-base' : 'text-sm'} text-slate-500`}>
                {item.quantity} {item.unit}
              </span>
              {item.notes && (
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Note
                </Badge>
              )}
            </div>
            {item.notes && !isEditing && (
              <p className={`${shoppingMode ? 'text-sm' : 'text-xs'} text-slate-500 mt-1 italic`}>{item.notes}</p>
            )}
          </div>
        )}

        {!shoppingMode && (
          <div className="flex gap-1">
            {isEditing ? (
              <>
                <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8">
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8">
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="h-4 w-4 text-slate-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(item.id)}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}