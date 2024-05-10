import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export function useDimensions() {
    const [dimensions, setDimensions] = useState({
        window: Dimensions.get('window'),
        screen: Dimensions.get('screen'),
    });

    useEffect(() => {
        const subscription = Dimensions.addEventListener(
            'change',
            ({ window, screen }) => {
                setDimensions({ window, screen });
            },
        );
        return () => subscription?.remove();
    }, []);

    return dimensions;
}
