import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { ChevronDown, Download, Plus, Edit2, X, Check, Calendar, Menu, Eye, EyeOff, Trash2, ListTodo } from 'lucide-react';
import('js-circle-progress').then(() => {
  // Веб-компонент має бути зареєстрований після імпорту
  if (!customElements.get('circle-progress')) {
    console.warn('circle-progress not registered');
  }
});
export const NumberCell = ({ value, onChange }) => {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-center px-1 py-0.5 text-lg bg-transparent border-none 
                 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none
                 [&::-webkit-outer-spin-button]:appearance-none
                 [&::-webkit-inner-spin-button]:appearance-none"
      style={{
        MozAppearance: "textfield", // Для Firefox
      }}
    />
  );
};