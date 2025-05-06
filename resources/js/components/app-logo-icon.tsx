import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 5C19.2 5 18.5 5.7 18.5 6.5V10.5H21.5V6.5C21.5 5.7 20.8 5 20 5Z" fill="white"/>
            <path d="M8 12.5C8 11.7 8.7 11 9.5 11H30.5C31.3 11 32 11.7 32 12.5C32 13.3 31.3 14 30.5 14H29V30C29 31.7 27.7 33 26 33H14C12.3 33 11 31.7 11 30V14H9.5C8.7 14 8 13.3 8 12.5Z" fill="white"/>
        </svg>
    );
}
