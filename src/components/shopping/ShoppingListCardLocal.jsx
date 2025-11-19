import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ShoppingCart, MoreVertical, Trash2, Edit } from 'lucide-react';
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { motion } from "framer-motion";

export default function ShoppingListCardLocal({ list, itemCount, onSelect, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1" onClick={onSelect}>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{list.name}</h3>
                <p className="text-sm text-slate-500">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete List
                </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
                </div>
                <div className="text-xs text-slate-400">
                Created {format(new Date(list.created_date), 'MMM d, yyyy')}
                </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}