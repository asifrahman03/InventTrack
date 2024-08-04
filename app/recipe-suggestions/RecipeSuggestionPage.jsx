"use client";
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase'; // Make sure this path is correct
import Button from '@/components/ui/button';

const RecipeSuggestionPage = () => {
  const [inventory, setInventory] = useState([]);
  const [suggestedRecipe, setSuggestedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoadingInventory(true);
      try {
        const querySnapshot = await getDocs(collection(firestore, 'inventory'));
        const items = querySnapshot.docs.map(doc => doc.data().name);
        setInventory(items);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setIsLoadingInventory(false);
      }
    };

    fetchInventory();
  }, []);

  const parseRecipe = (recipeString) => {
    const lines = recipeString.split('\n');
    const name = lines[0].trim();
    const ingredients = [];
    const instructions = [];
    let currentSection = '';

    for (const line of lines.slice(1)) {
      if (line.toLowerCase().includes('ingredients:')) {
        currentSection = 'ingredients';
        continue;
      } else if (line.toLowerCase().includes('instructions:')) {
        currentSection = 'instructions';
        continue;
      }

      if (currentSection === 'ingredients' && line.trim().startsWith('-')) {
        ingredients.push(line.trim().substring(1).trim());
      } else if (currentSection === 'instructions') {
        instructions.push(line.trim());
      }
    }

    return { name, ingredients, instructions };
  };

  const generateRecipe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('../api/llama3.1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: inventory }),
      });
  
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to fetch recipe: ${response.status} ${response.statusText}. Body: ${errorBody}`);
      }
  
      const data = await response.json();
      const parsedRecipe = parseRecipe(data.choices[0].message.content);
      console.log(parsedRecipe);
      setSuggestedRecipe(parsedRecipe);
    } catch (error) {
      console.error('Error generating recipe:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-r from-blue-100 to-blue-300 p-6 overflow-auto">
      <h1 className="text-5xl font-bold text-center text-blue-900 mb-8">RecipeTrack</h1>
      
      <div className="w-full max-w-4xl mb-8">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-xl shadow-lg" 
          onClick={generateRecipe}
          disabled={isLoading || isLoadingInventory}
        >
          {isLoading ? 'Generating...' : 'Generate Recipe'}
        </Button>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Inventory</h2>
        {isLoadingInventory ? (
          <p>Loading inventory...</p>
        ) : (
          <ul className="list-disc list-inside">
            {inventory.map((item, index) => (
              <li key={index} className="mb-1">{item}</li>
            ))}
          </ul>
        )}
      </div>

      {suggestedRecipe && (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-bold mb-6">{suggestedRecipe.name}</h2>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Instructions:</h3>
            <div className="space-y-2">
              {suggestedRecipe.instructions.map((step, index) => (
                <p key={index}>{step}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSuggestionPage;