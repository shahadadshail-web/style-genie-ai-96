import { cn } from "@/lib/utils";

interface MannequinSilhouetteProps {
  className?: string;
}

export const MannequinSilhouette = ({ className }: MannequinSilhouetteProps) => {
  return (
    <svg
      viewBox="0 0 200 500"
      className={cn("w-full h-full", className)}
      style={{
        filter: "drop-shadow(0 0 20px hsl(270 100% 65% / 0.6)) drop-shadow(0 0 40px hsl(270 100% 75% / 0.4))"
      }}
    >
      {/* Head */}
      <ellipse
        cx="100"
        cy="40"
        rx="25"
        ry="30"
        fill="none"
        stroke="hsl(270 100% 65%)"
        strokeWidth="2"
      />
      
      {/* Neck */}
      <path
        d="M 90 68 L 90 85 L 110 85 L 110 68"
        fill="none"
        stroke="hsl(270 100% 65%)"
        strokeWidth="2"
      />
      
      {/* Shoulders and Torso */}
      <path
        d="M 45 95 
           Q 50 85 90 85 
           L 110 85 
           Q 150 85 155 95
           L 160 130
           Q 162 145 155 160
           L 145 200
           L 140 220
           Q 138 230 140 240
           L 135 260
           L 65 260
           L 60 240
           Q 62 230 60 220
           L 55 200
           L 45 160
           Q 38 145 40 130
           Z"
        fill="none"
        stroke="hsl(270 100% 65%)"
        strokeWidth="2"
      />
      
      {/* Left Arm */}
      <path
        d="M 45 95 
           Q 30 100 25 130
           Q 20 160 22 190
           Q 24 220 28 250
           Q 30 260 32 270"
        fill="none"
        stroke="hsl(270 100% 65%)"
        strokeWidth="2"
      />
      
      {/* Right Arm */}
      <path
        d="M 155 95 
           Q 170 100 175 130
           Q 180 160 178 190
           Q 176 220 172 250
           Q 170 260 168 270"
        fill="none"
        stroke="hsl(270 100% 65%)"
        strokeWidth="2"
      />
      
      {/* Hips/Pelvis */}
      <path
        d="M 65 260 
           Q 60 275 60 290
           L 70 300
           L 130 300
           L 140 290
           Q 140 275 135 260"
        fill="none"
        stroke="hsl(270 100% 65%)"
        strokeWidth="2"
      />
      
      {/* Left Leg */}
      <path
        d="M 70 300 
           Q 65 330 65 360
           L 68 400
           L 70 440
           Q 70 455 68 470
           L 50 475
           L 48 485
           L 85 485
           L 83 475
           L 73 470"
        fill="none"
        stroke="hsl(270 100% 65%)"
        strokeWidth="2"
      />
      
      {/* Right Leg */}
      <path
        d="M 130 300 
           Q 135 330 135 360
           L 132 400
           L 130 440
           Q 130 455 132 470
           L 150 475
           L 152 485
           L 115 485
           L 117 475
           L 127 470"
        fill="none"
        stroke="hsl(270 100% 65%)"
        strokeWidth="2"
      />
      
      {/* Center Line (subtle) */}
      <line
        x1="100"
        y1="85"
        x2="100"
        y2="300"
        stroke="hsl(270 100% 65% / 0.3)"
        strokeWidth="1"
        strokeDasharray="5,5"
      />
    </svg>
  );
};
