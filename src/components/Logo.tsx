    import React from 'react';

    interface LogoProps {
      size?: number;
    }

    const Logo: React.FC<LogoProps> = ({ size = 40 }) => {
      return (
        <div 
          className="relative" 
          style={{ width: size, height: size }}
        >
          <div 
            className="absolute inset-0 rounded-full border-2 border-lolo-pink"
            style={{ 
              width: size, 
              height: size,
              boxShadow: '0 0 10px #FF00FF'
            }}
          ></div>
          <div 
            className="absolute inset-0 rounded-full border border-lolo-cyan"
            style={{ 
              width: size - 5, 
              height: size - 5,
              top: '2.5px',
              left: '2.5px',
              boxShadow: '0 0 5px #00FFFF'
            }}
          ></div>
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              fontSize: size * 0.4,
              fontWeight: 'bold'
            }}
          >
            <span className="text-white">L</span>
            <span className="text-lolo-red">o</span>
            <span className="text-white">L</span>
            <span className="text-lolo-red">o</span>
          </div>
        </div>
      );
    };

    export default Logo;