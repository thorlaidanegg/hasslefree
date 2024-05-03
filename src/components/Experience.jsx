import { useEffect, useMemo, useRef } from 'react';
import { Float, PerspectiveCamera, Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Group } from "three";
import { Airplane } from "./Airplane";
import  {Background} from "./Background";
import { NightCity } from "./NightCity";
import { OrbitControls } from "@react-three/drei";
import { Speed } from './Speed';

const LINE_NB_POINTS = 10000;
// const CURVE_DISTANCE = 100;
const CURVE_AHEAD_CAMERA = 0.008;
const CURVE_AHEAD_AIRPLANE = 0.02;
const AIRPLANE_MAX_ANGLE = 35;

export const Experience = () => {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(0, 0, -15),
        new THREE.Vector3(0.5, 0, -20),
        new THREE.Vector3(-1, 0, -33),
        new THREE.Vector3(-4.25, 0, -37),
        new THREE.Vector3(-3.8, 0, -45),
        new THREE.Vector3(-5, 0, -50),
        new THREE.Vector3(0, 0, -55),
        new THREE.Vector3(12, 0, -59),
        new THREE.Vector3(11, 0, -70),
        new THREE.Vector3(11, 0, -75),
        new THREE.Vector3(16, 0, -80),
        new THREE.Vector3(16, 0, -90),
        new THREE.Vector3(20, 0, -95),
        new THREE.Vector3(36, 0, -102),
        new THREE.Vector3(36, 0, -110),
        new THREE.Vector3(50, 0, -90),
        new THREE.Vector3(50, 0, -40),
        new THREE.Vector3(0, 0, 0)           
      ],
      false,
      "catmullrom",
      0.5
    );
  }, []);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);

    return shape;
  }, [curve]);

  const cameraGroup = useRef();
  const scroll = useScroll();

  useFrame((_state, delta) => {
    const scrollOffset = Math.max(0, scroll.offset);

    const curPoint = curve.getPoint(scrollOffset);

    // Follow the curve points
    cameraGroup.current.position.lerp(curPoint, delta * 24);

    // Make the group look ahead on the curve

    const lookAtPoint = curve.getPoint(
      Math.min(scrollOffset + CURVE_AHEAD_CAMERA, 1)
    );

    const currentLookAt = cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    );
    const targetLookAt = new THREE.Vector3()
      .subVectors(curPoint, lookAtPoint)
      .normalize();

    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)
    );

    // Airplane rotation

    const tangent = curve.getTangent(scrollOffset + CURVE_AHEAD_AIRPLANE);

    const nonLerpLookAt = new Group();
    nonLerpLookAt.position.copy(curPoint);
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));

    tangent.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -nonLerpLookAt.rotation.y
    );

    let angle = Math.atan2(-tangent.z, tangent.x);
    angle = -Math.PI / 2 + angle;

    let angleDegrees = (angle * 180) / Math.PI;
    angleDegrees *= 2.4; // stronger angle

    // LIMIT PLANE ANGLE
    if (angleDegrees < 0) {
      angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
    }
    if (angleDegrees > 0) {
      angleDegrees = Math.min(angleDegrees, AIRPLANE_MAX_ANGLE);
    }

    // SET BACK ANGLE
    angle = (angleDegrees * Math.PI) / 180;

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angle
      )
    );
    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);
  });

  const airplane = useRef();

  return (
    <>
      {/* Lights */}
      <directionalLight position={[0, 3, 1]} intensity={0.1} />
      
      {/* Main Group */}
      <group ref={cameraGroup}>
        {/* Background */}
        <Speed/>
        <Background />
        
        {/* Camera */}
        <PerspectiveCamera position={[0, 0, 2]} fov={40} makeDefault />
        
        {/* Airplane */}
        <group ref={airplane}>
          <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
            <Airplane
              rotation-y={Math.PI / 2}
              scale={[0.2, 0.2, 0.2]}
              position-z={-1}
            />
          </Float>
        </group>
      </group>
      
      {/* Text Components */}
      <group position={[0, 1, -7]}>
        <mesh
          onClick={() => {
            window.open('https://example.com', '_blank');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <Text
            color="white"
            anchorX="left"
            anchorY="middle"
            fontSize={0.52}
            maxWidth={3}
            fontWeight="bold"
            font="./fonts/Inter-Regular.ttf"
            outlineColor="black" // Add an outline color
            outlineWidth={0.02}   // Set the width of the outline
            backgroundColor="rgba(0, 0, 0, 0.5)" 
          >
            Welcome to Hassle Free
          </Text>
        </mesh>
      </group>

      <group position={[-1.5, 1.5, -33]}>
        <mesh
          onClick={() => {
            window.open('https://drive.google.com/file/d/1iMi-RPgceaLzPxHgM-qt_R9khSIKl4VA/view', '_blank');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <Text
            color="white"
            anchorX="left"
            anchorY="middle"
            fontSize={0.52}
            maxWidth={3}
            fontWeight="bold"
            font="./fonts/Inter-Regular.ttf"
            outlineColor="black" // Add an outline color
            outlineWidth={0.02}   // Set the width of the outline
            backgroundColor="rgba(0, 0, 0, 0.5)" 
          >
            Lisence Plate Entry System
          </Text>
        </mesh>

        
      </group>

      <group position={[4, 1, -57.5]} rotation-y={-1.2}>
        <mesh
          onClick={() => {
            window.open('https://drive.google.com/file/d/1iImhvxzeTrGW_xTsxDXYx-g__YWVrFhr/view', '_blank');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <Text
            color="white"
            anchorX="left"
            anchorY="middle"
            fontSize={0.52}
            maxWidth={3}
            fontWeight="bold"
            font="./fonts/Inter-Regular.ttf"
            outlineColor="black" // Add an outline color
            outlineWidth={0.02}   // Set the width of the outline
            backgroundColor="rgba(0, 0, 0, 0.5)" 
          >
            Potholes Detection System
          </Text>
        </mesh>
      </group>

      <group position={[17, 1, -79.5]} rotation-y={-1.1}>
        <mesh
          onClick={() => {
            window.open('https://drive.google.com/file/d/1iMs2cNnLduuSLbygCIGYMuXvSrEzyAmG/view', '_blank');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <Text
            color="white"
            anchorX="left"
            anchorY="middle"
            fontSize={0.52}
            maxWidth={3}
            fontWeight="bold"
            font="./fonts/Inter-Regular.ttf"
            outlineColor="black" // Add an outline color
            outlineWidth={0.02}   // Set the width of the outline
            backgroundColor="rgba(0, 0, 0, 0.5)" 
          >
            Attendance system
          </Text>
        </mesh>
      </group>

      {/* Line */}
      <group position-y={-2}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshBasicMaterial
            color={"white"}
            opacity={1}
            transparent
            envMapIntensity={2}
          />
        </mesh>
      </group>

      {/* City */}
      <NightCity scale={[0.1, 0.1, 0.1]} position-y={-2} position-z={-12} position-x={0.01} />
      <NightCity scale={[0.1, 0.1, 0.1]} position-y={-2} position-z={-31}/>
      <NightCity scale={[0.1, 0.1, 0.1]} position-y={-2} position-z={-51}/>
      <NightCity scale={[0.1, 0.1, 0.1]} position-y={-2} position-z={-70} position-x={11} />
      <NightCity scale={[0.1, 0.1, 0.1]} position-y={-2} position-z={-92} position-x={21}/>
      <NightCity scale={[0.1, 0.1, 0.1]} position-y={-2} position-z={-108} position-x={21}/>
    </>
  );
};