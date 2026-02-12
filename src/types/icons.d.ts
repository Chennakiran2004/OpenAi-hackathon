import React from 'react';

declare module 'react-icons' {
    export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
        children?: React.ReactNode;
        size?: string | number;
        color?: string;
        title?: string;
    }
    export type IconType = (props: IconBaseProps) => JSX.Element;
}

declare module 'react-icons/hi' {
    export * from 'react-icons';
}

declare module 'react-icons/ri' {
    export * from 'react-icons';
}

declare module 'react-icons/fi' {
    export * from 'react-icons';
}

declare module 'react-icons/fa' {
    export * from 'react-icons';
}
