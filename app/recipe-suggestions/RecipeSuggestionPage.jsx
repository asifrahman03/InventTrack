"use client";
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase'; // Make sure this path is correct
import Button from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
        // Handle error (e.g., show an error message to the user)
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
    let inIngredients = false;

    for (const line of lines.slice(1)) {
      if (line.toLowerCase().includes('ingredients:')) {
        inIngredients = true;
        continue;
      }
      if (inIngredients && line.trim().startsWith('-')) {
        ingredients.push(line.trim().substring(1).trim());
      }
    }

    return { name, ingredients };
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
      // Display error message to the user
      // For example: setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateRecipe = () => {
    generateRecipe();
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center align-middle bg-gradient-to-r from-blue-100 to-blue-300 p-6">
      <h1 className="text-5xl font-bold text-center text-blue-900 mb-12">RecipeTrack</h1>
      
      <div className="w-full max-w-4xl mb-8">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-xl shadow-lg" 
          onClick={generateRecipe}
          disabled={isLoading || isLoadingInventory}
        >
          {isLoading ? 'Generating...' : 'Generate Recipe'}
        </Button>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white p-6 rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold mb-4">Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingInventory ? (
              <p>Loading inventory...</p>
            ) : (
              <textarea
                className="w-full h-64 p-4 border rounded resize-none bg-gray-50"
                readOnly
                value={inventory.join('\n')}
              />
            )}
          </CardContent>
        </Card>

        {suggestedRecipe && (
          <Card className="bg-white p-6 rounded-lg shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-4">{suggestedRecipe.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold mb-2">Ingredients:</p>
              <ul className="list-disc list-inside mb-4">
                {suggestedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className={inventory.includes(ingredient) ? 'text-green-600' : ''}>
                    {ingredient}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 text-lg shadow-md" 
                onClick={regenerateRecipe}
                disabled={isLoading}
              >
                {isLoading ? 'Regenerating...' : 'Regenerate Recipe'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecipeSuggestionPage;