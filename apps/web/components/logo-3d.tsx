"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Center } from "@react-three/drei";
import * as THREE from "three";

function Coin() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const texture = useMemo(() => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="2048" height="2048">
        <rect width="1000" height="1000" rx="500" fill="white" />
        <g transform="rotate(270 500 500)">
          <path d="M482.372 360.458C491.341 321.22 502.508 282.568 513.532 243.874C516.502 233.45 517.465 222.777 515.616 211.956C512.937 196.275 501.226 188.801 485.825 193.289C476.039 196.14 468.37 202.304 461.815 209.854C440.994 233.836 431.499 262.958 424.209 293.028C415.667 328.26 409.809 364.009 404.032 399.76C402.912 406.691 399.771 410.476 393.08 412.78C382.026 416.586 371.255 421.232 360.454 425.737C324.553 440.709 289.698 457.671 257.778 480.119C250.429 485.286 243.589 491.125 238.772 498.769C231.309 510.613 235.17 521.722 248.146 523.046C265.866 524.854 283.775 525.837 301.156 519.418C329.239 509.048 356.215 496.257 383.081 483.176C385.877 481.815 388.41 478.725 393.146 480.841C390.226 494.767 386.975 508.719 384.406 522.794C374.806 575.401 364.702 628.004 372.476 681.903C377.695 718.09 391.541 749.848 420.844 773.339C458.297 803.364 501.529 812.495 548.43 807.862C616.8 801.108 673.858 772.012 719.88 721.242C721.787 719.138 724.496 717.28 723.74 712.776C720.514 714.929 717.981 716.551 715.52 718.276C703.397 726.772 691.052 734.926 677.165 740.317C622.574 761.509 567.509 760.274 512.45 742.697C479.344 732.127 451.359 713.718 430.849 685.126C427.99 681.141 424.79 677.108 425.17 671.304C426.51 671.761 427.27 671.783 427.583 672.167C428.938 673.831 430.29 675.521 431.413 677.342C442.88 695.947 458.827 709.795 478.165 719.509C548.588 754.885 618.66 751.081 685.511 711.966C727.289 687.522 755.717 650.579 764.513 601.233C765.424 596.118 766.499 590.962 763.873 583.439C750.244 621.98 728.465 652.046 697.444 674.941C666.311 697.919 630.923 710.481 592.284 710.027C554.311 709.58 518.427 700.086 487.856 675.29C545.082 706.228 602.354 705.222 659.025 675.338C711.051 647.904 767.236 567.842 758.355 535.716C757.809 535.876 756.952 535.873 756.768 536.222C755.488 538.652 754.248 541.112 753.178 543.64C746.168 560.194 737.628 575.98 724.741 588.619C677.388 635.059 620.351 653.939 554.893 643.64C518.617 637.933 491.962 617.454 479.611 581.76C463.315 534.662 463.039 486.614 472.233 438.075C473.549 431.128 476.793 427.564 483.081 424.905C510.082 413.491 537.869 404.365 565.908 395.972C623.874 378.622 683.172 367.584 742.984 358.941C750.354 357.876 758.224 358.234 766 353.676C763.689 352.808 762.372 352.163 760.981 351.827C759.194 351.396 757.357 351.12 755.525 350.935C713.219 346.671 671.203 350.802 629.287 355.821C585.535 361.061 542.568 370.854 499.382 379.339C476.985 383.74 476.974 383.68 482.372 360.458Z" fill="#000000" />
        </g>
      </svg>
    `;
    const encoded = encodeURIComponent(svg);
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encoded}`;
    const texture = new THREE.TextureLoader().load(dataUrl);
    texture.anisotropy = 16; // Increase anisotropy for sharper texture
    return texture;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Levitation effect
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;

      // Horizontal movement
      meshRef.current.position.x = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={(viewport.width / 4) * 1.25} // Increased by 25%
      rotation={[Math.PI / 2, 0, 0]}
    >
      <cylinderGeometry args={[1, 1, 0.1, 64]} />
      <meshStandardMaterial
        color="#FFFFFF"
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
      >
        <primitive attach="map" object={texture} />
      </meshStandardMaterial>
    </mesh>
  );
}

export default function Component() {
  return (
    <div className="h-48 w-48 md:w-96 md:h-80 bg-background">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />{" "}
        {/* Increased ambient light intensity */}
        <directionalLight
          position={[0, 0, 20]} // Positioned in front of the coin
          intensity={0.2} // Increased intensity
          color="#ffffff"
        />
        <Center>
          <Coin />
        </Center>
        <Environment preset="city" /> {/* Reduced environment intensity */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
