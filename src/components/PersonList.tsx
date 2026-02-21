import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Users } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useBillStore } from '../stores/billStore';

export const PersonList: React.FC = () => {
  const { currentBill, addPerson, removePerson } = useBillStore();
  const [newPersonName, setNewPersonName] = useState('');

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      addPerson(newPersonName.trim());
      setNewPersonName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPerson();
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">Người tham gia</h2>
        </div>

        {/* Add Person Input */}
        <div className="flex gap-3">
          <Input
            placeholder="Nhập tên người tham gia..."
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleAddPerson} disabled={!newPersonName.trim()}>
            <UserPlus className="w-5 h-5" />
          </Button>
        </div>

        {/* Person List */}
        <div className="space-y-3">
          <AnimatePresence>
            {currentBill?.people.map((person) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold">
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 text-zinc-100 font-medium">{person.name}</span>
                <button
                  onClick={() => removePerson(person.id)}
                  className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {currentBill?.people.length === 0 && (
            <div className="text-center py-8 text-zinc-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có người tham gia nào</p>
              <p className="text-sm">Nhập tên và nhấn thêm để bắt đầu</p>
            </div>
          )}
        </div>

        {currentBill?.people && currentBill.people.length > 0 && (
          <div className="pt-4 border-t border-zinc-800">
            <p className="text-center text-zinc-400 text-sm">
              Đã có <span className="font-bold text-zinc-200">{currentBill.people.length}</span> người tham gia
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
