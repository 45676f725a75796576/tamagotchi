import React from 'react';

interface PetSelectorProps {
    onSelect: (pet: string) => void;
}

const PetSelector: React.FC<PetSelectorProps> = ({ onSelect }) => {
    const handleSelect = (pet: string) => {
        localStorage.setItem('pet', pet);
        onSelect(pet);
    };

    return (
        <div className="pet-selector">
            <h2>Select your pet</h2>
            <button onClick={() => handleSelect('verstappen')}>Verstappen</button>
            <button onClick={() => handleSelect('hamilton')}>Hamilton</button>
            <button onClick={() => handleSelect('sainz')}>Sainz</button>
        </div>
    );
};

export default PetSelector;
