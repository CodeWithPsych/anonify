import React from 'react';
import { HashLoader } from 'react-spinners';

const ReactLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <HashLoader
                color="#000000"
                size={80}
            />
        </div>
    );
};

export default ReactLoader;
