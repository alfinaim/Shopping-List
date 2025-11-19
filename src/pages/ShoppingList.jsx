import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Plus, ShoppingBasket, Download, Upload, MoreVertical, Bookmark } from 'lucide-react';
import { AnimatePresence } from "framer-motion";
import ShoppingListCardLocal from "../components/shopping/ShoppingListCardLocal";
import ListDetailModalLocal from "../components/shopping/ListDetailModalLocal";
import {
  getShoppingLists,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
  getShoppingItems,
  getItemCountForList,
  exportData,
  importData
} from "../components/shopping/localStorage";

export default function ShoppingLists() {
  const [lists, setLists] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [editingList, setEditingList] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [editListName, setEditListName] = useState('');
  const [isTemplate, setIsTemplate] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [deleteConfirmList, setDeleteConfirmList] = useState(null);
  const [importMessage, setImportMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, [refresh]);

  const loadData = () => {
    setLists(getShoppingLists());
    setAllItems(getShoppingItems());
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      const newList = createShoppingList(newListName);
      if (isTemplate) {
        updateShoppingList(newList.id, { is_template: true });
      }
      setShowCreateDialog(false);
      setNewListName('');
      setIsTemplate(false);
      loadData();
    }
  };

  const handleExport = () => {
    exportData();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      importData(file)
        .then(() => {
          loadData();
          setImportMessage({ type: 'success', message: 'Data imported successfully!' });
        })
        .catch((error) => {
          setImportMessage({ type: 'error', message: 'Failed to import data: ' + error.message });
        });
    }
    e.target.value = '';
  };

  const handleSaveAsTemplate = (list) => {
    updateShoppingList(list.id, { is_template: true });
    loadData();
  };

  const handleCreateFromTemplate = (template) => {
    const newList = createShoppingList(template.name + ' (Copy)');
    const templateItems = getShoppingItems(template.id);
    templateItems.forEach(item => {
      const { id, created_date, updated_date, shopping_list_id, checked, ...itemData } = item;
      const newItemData = { ...itemData, shopping_list_id: newList.id, checked: false };
      const items = getShoppingItems();
      const newItem = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...newItemData,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      };
      items.push(newItem);
      localStorage.setItem('shopping_items', JSON.stringify(items));
    });
    loadData();
  };

  const handleEditList = (list) => {
    setEditingList(list);
    setEditListName(list.name);
    setShowEditDialog(true);
  };

  const handleUpdateList = () => {
    if (editListName.trim() && editingList) {
      updateShoppingList(editingList.id, { name: editListName });
      setShowEditDialog(false);
      setEditingList(null);
      setEditListName('');
      loadData();
      
      // Update selected list if it's the one being edited
      if (selectedList?.id === editingList.id) {
        setSelectedList({ ...editingList, name: editListName });
      }
    }
  };

  const handleDeleteList = (list) => {
    setDeleteConfirmList(list);
  };

  const confirmDelete = () => {
    if (deleteConfirmList) {
      deleteShoppingList(deleteConfirmList.id);
      setDeleteConfirmList(null);
      loadData();
    }
  };

  const handleSelectList = (list) => {
    setSelectedList(list);
  };

  const handleUpdate = () => {
    loadData();
    // Refresh selected list data
    if (selectedList) {
      const updatedList = getShoppingLists().find(l => l.id === selectedList.id);
      if (updatedList) {
        setSelectedList(updatedList);
      }
    }
  };

  const getItemCount = (listId) => {
    return allItems.filter(item => item.shopping_list_id === listId).length;
  };

  const getListItems = (listId) => {
    return allItems.filter(item => item.shopping_list_id === listId);
  };

  const templates = lists.filter(list => list.is_template);
  const regularLists = lists.filter(list => !list.is_template);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Shopping Lists</h1>
              <p className="text-slate-600">Organize your shopping - works offline!</p>
            </div>
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-white">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <label className="cursor-pointer flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                      />
                    </label>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                New List
              </Button>
            </div>
          </div>
        </div>

        {/* Templates */}
        {templates.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Bookmark className="h-6 w-6 text-emerald-600" />
              Templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {templates.map((template) => (
                  <div key={template.id} className="relative">
                    <ShoppingListCardLocal
                      list={template}
                      itemCount={getItemCount(template.id)}
                      onSelect={() => handleSelectList(template)}
                      onEdit={() => handleEditList(template)}
                      onDelete={() => handleDeleteList(template)}
                    />
                    <Button
                      onClick={() => handleCreateFromTemplate(template)}
                      className="absolute top-2 right-2 bg-emerald-600 hover:bg-emerald-700"
                      size="sm"
                    >
                      Use Template
                    </Button>
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Lists Grid */}
        {regularLists.length === 0 && templates.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingBasket className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-2">No lists yet</h3>
            <p className="text-slate-600 mb-6">Create your first shopping list to get started</p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="text-white bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First List
            </Button>
          </div>
        ) : regularLists.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">My Lists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {regularLists.map((list) => (
                  <div key={list.id} className="relative">
                    <ShoppingListCardLocal
                      list={list}
                      itemCount={getItemCount(list.id)}
                      onSelect={() => handleSelectList(list)}
                      onEdit={() => handleEditList(list)}
                      onDelete={() => handleDeleteList(list)}
                    />
                    <Button
                      onClick={() => handleSaveAsTemplate(list)}
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : null}

        {/* Create List Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Create New Shopping List</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <Input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter list name (e.g., Weekly Groceries)"
                onKeyDown={(e) => e.key === 'Enter' && !isTemplate && handleCreateList()}
                className="bg-white"
              />
              <div className="flex items-center space-x-2">
                <Switch
                  id="template-mode"
                  checked={isTemplate}
                  onCheckedChange={setIsTemplate}
                />
                <Label htmlFor="template-mode">
                  Save as template
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="bg-white">
                Cancel
              </Button>
              <Button
                onClick={handleCreateList}
                disabled={!newListName.trim()}
                className="text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Create List
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit List Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Edit List Name</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={editListName}
                onChange={(e) => setEditListName(e.target.value)}
                placeholder="Enter list name"
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateList()}
                className="bg-white"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="bg-white">
                Cancel
              </Button>
              <Button
                onClick={handleUpdateList}
                disabled={!editListName.trim()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirmList} onOpenChange={() => setDeleteConfirmList(null)}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Delete List</DialogTitle>
            </DialogHeader>
            <p className="text-slate-600 py-4">
              Are you sure you want to delete "{deleteConfirmList?.name}"? This will also delete all items in this list.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmList(null)} className="bg-white">
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Message Dialog */}
        <Dialog open={!!importMessage} onOpenChange={() => setImportMessage(null)}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>{importMessage?.type === 'success' ? 'Success' : 'Error'}</DialogTitle>
            </DialogHeader>
            <p className="text-slate-600 py-4">
              {importMessage?.message}
            </p>
            <DialogFooter>
              <Button onClick={() => setImportMessage(null)} className="bg-emerald-600 hover:bg-emerald-700">
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* List Detail Modal */}
        {selectedList && (
          <ListDetailModalLocal
            list={selectedList}
            items={getListItems(selectedList.id)}
            open={!!selectedList}
            onClose={() => setSelectedList(null)}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
}