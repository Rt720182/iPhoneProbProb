import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// DraggablePhone component
const DraggablePhone = ({ color }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "phone",
    item: { color },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const phoneColor = color === "green" ? "#3E6C45" : "#C199CC";
  const screenColor = color === "green" ? "#6F9C71" : "#E5C5E9";

  return (
    <div
      ref={drag}
      style={{
        width: "40px",
        height: "80px",
        backgroundColor: phoneColor,
        borderRadius: "10px",
        position: "relative",
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        margin: "10px",
        display: "inline-block",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          right: "10px",
          bottom: "10px",
          backgroundColor: screenColor,
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

const MindSparks = ({ totalClassmates, step, setStep }) => {
  const mindSparksContent = [
    "Start by setting the number of classmates Billy might have.",
    `You've set ${totalClassmates} classmates. This means there are ${Math.pow(
      2,
      totalClassmates
    )} possible arrangements. Notice how each person in the bottom row has a unique number, from 1 to ${Math.pow(
      2,
      totalClassmates
    )}. These numbers represent all possible combinations of boys and girls.`,
    `Try adding some iPhones to Billy's classmates. Green for boys, purple for girls.`,
    `Each time you drag an iPhone to a classmate, they receive it and smile!`,
    "The goal is to distribute the iPhones to as many classmates as possible.",
  ];

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        width: "100%",
      }}
    >
      <h3>Mind Sparks</h3>
      <p>{mindSparksContent[step]}</p>
      <button
        onClick={() =>
          setStep((prevStep) =>
            Math.min(prevStep + 1, mindSparksContent.length - 1)
          )
        }
      >
        Next Spark
      </button>
    </div>
  );
};

// StickFigure component

const StickFigure = ({
  gender,
  number,
  showNumber,
  hasPhone,
  onDrop,
  isBottomRow,
}) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "phone",
    drop: (item) => onDrop(item.color),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isGreen = gender === "boy";
  const mainColor = isGreen ? "#4CAF50" : "#9C27B0";
  const skinColor = isGreen ? "#A5D6A7" : "#E1BEE7";
  const faceColor = isOver && canDrop ? "#FFD700" : skinColor;

  return (
    <div
      ref={drop}
      style={{
        textAlign: "center",
        margin: "10px",
        position: "relative",
        border: isOver ? "2px dashed #FFD700" : "none",
      }}
    >
      <svg width="60" height="120" viewBox="0 0 60 120">
        <ellipse cx="30" cy="55" rx="15" ry="25" fill={mainColor} />

        {isBottomRow && (
          <text x="30" y="60" textAnchor="middle" fill="white" fontSize="20">
            {number}
          </text>
        )}
        <circle cx="30" cy="25" r="15" fill={faceColor} />
        {/* Facial Expression - changes to smile if the individual has an iPhone */}
        {hasPhone ? (
          <path
            d="M20,30 Q30,40 40,30"
            stroke="black"
            strokeWidth="2"
            fill="none"
          />
        ) : (
          <path
            d="M20,35 Q30,25 40,35"
            stroke="black"
            strokeWidth="2"
            fill="none"
          />
        )}
        <line
          x1="15"
          y1="45"
          x2="5"
          y2="60"
          stroke={mainColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="45"
          y1="45"
          x2="55"
          y2="60"
          stroke={mainColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="80"
          x2="20"
          y2="110"
          stroke={mainColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="35"
          y1="80"
          x2="40"
          y2="110"
          stroke={mainColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Display iPhone next to the individual if they have received it */}
        {hasPhone && (
          <rect
            x="42"
            y="50"
            width="10"
            height="20"
            fill={isGreen ? "#3E6C45" : "#C199CC"}
            rx="3"
            ry="3"
          />
        )}
      </svg>
      <div style={{ marginTop: "5px", fontWeight: "bold", color: mainColor }}>
        {isGreen ? "Boy" : "Girl"}
      </div>
    </div>
  );
};

// PossibilityTree component
const PossibilityTree = ({
  level,
  updateFigurePhoneStatus,
  phonesGiven,
  totalLevels,
}) => {
  if (level === 0) return null;

  const isBottomRow = level === 1;
  const startNumber = Math.pow(2, totalLevels - level);

  const renderFigure = (gender, number) => (
    <StickFigure
      gender={gender}
      number={isBottomRow ? number : null}
      showNumber={isBottomRow}
      hasPhone={phonesGiven[number]}
      onDrop={(color) => updateFigurePhoneStatus(number, color)}
      isBottomRow={isBottomRow}
    />
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {renderFigure("boy", startNumber)}
          {level > 1 && (
            <>
              <div
                style={{
                  width: "2px",
                  height: "20px",
                  backgroundColor: "#888",
                  margin: "5px 0",
                }}
              />
              <PossibilityTree
                level={level - 1}
                updateFigurePhoneStatus={updateFigurePhoneStatus}
                phonesGiven={phonesGiven}
                totalLevels={totalLevels}
              />
            </>
          )}
        </div>
        <div
          style={{ margin: "0 20px", alignSelf: "center", fontWeight: "bold" }}
        >
          OR
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {renderFigure("girl", startNumber + 1)}
          {level > 1 && (
            <>
              <div
                style={{
                  width: "2px",
                  height: "20px",
                  backgroundColor: "#888",
                  margin: "5px 0",
                }}
              />
              <PossibilityTree
                level={level - 1}
                updateFigurePhoneStatus={updateFigurePhoneStatus}
                phonesGiven={phonesGiven}
                totalLevels={totalLevels}
              />
            </>
          )}
        </div>
      </div>
      {level > 1 && (
        <div
          style={{
            width: "80%",
            height: "2px",
            backgroundColor: "#888",
            margin: "10px 0",
          }}
        />
      )}
    </div>
  );
};

// Main App component
const App = () => {
  const [children, setChildren] = useState(2);
  const [phonesGiven, setPhonesGiven] = useState({});
  const [greenPhones, setGreenPhones] = useState(0);
  const [purplePhones, setPurplePhones] = useState(0);

  const [sparkStep, setSparkStep] = useState(0);
  const [explanation, setExplanation] = useState(null);

  const handlePhoneDrop = (id, color) => {
    setPhonesGiven((prevState) => ({
      ...prevState,
      [id]: true,
    }));
    if (color === "green") {
      setGreenPhones((prev) => prev + 1);
    } else {
      setPurplePhones((prev) => prev + 1);
    }
  };

  const SparkIcon = ({ onClick }) => (
    <span
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: "5px",
        fontSize: "18px",
        color: "#FFD700",
      }}
    >
      ⚡
    </span>
  );

  const Explanation = ({ text, onClose }) => (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        zIndex: 1000,
      }}
    >
      <p>{text}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );

  const totalArrangements = Math.pow(2, children);
  const probability =
    children > 0
      ? ((greenPhones / children + purplePhones / children) / 2) * 100
      : 0;
  const showExplanation = (text) => {
    setExplanation(text);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100vw",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        overflowX: "auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>iPhone Probability Problem</h1>
      <p style={{ textAlign: "justify", marginBottom: "20px" }}>
        Billy is about to start up the school year as the new kid, and he knows
        nothing about his soon-to-be classmates. To make a good first
        impression, Billy plans to buy green and purple iPhones to give to the
        boys and girls, respectively. Help Billy figure out his odds of
        successfully buying friends by dragging iPhones to his classmates and
        observing the result.
      </p>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <label>Hypothetical Number of Classmates: {children}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={children}
          onChange={(e) => setChildren(Number(e.target.value))}
          style={{ width: "100%", maxWidth: "300px" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <DraggablePhone color="green" />
        <DraggablePhone color="purple" />
      </div>
      <div style={{ marginBottom: "20px", overflowX: "auto" }}>
        <h3 style={{ textAlign: "center" }}>Possible Classmate Types</h3>
        <PossibilityTree
          level={children}
          updateFigurePhoneStatus={handlePhoneDrop}
          phonesGiven={phonesGiven}
        />
      </div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h3>Analysis Mode:</h3>

        <p>
          Total Possible Arrangements: {totalArrangements}
          <SparkIcon
            onClick={() =>
              showExplanation(
                `The total number of possible arrangements is 2^${children} because each classmate can be either a boy or a girl, resulting in 2 choices for each of the ${children} classmates.`
              )
            }
          />
        </p>
        <p>
          Green iPhones: {greenPhones}
          <SparkIcon
            onClick={() =>
              showExplanation(
                `This is the number of green iPhones you've given out to boys.`
              )
            }
          />
        </p>
        <p>
          Purple iPhones: {purplePhones}
          <SparkIcon
            onClick={() =>
              showExplanation(
                `This is the number of purple iPhones you've given out to girls.`
              )
            }
          />
        </p>
        <p>
          Probability of having enough iPhones: {probability.toFixed(2)}%
          <SparkIcon
            onClick={() =>
              showExplanation(
                `This probability is calculated as ((greenPhones/children + purplePhones/children) / 2) * 100. It represents the average probability of having the right iPhone for a randomly chosen classmate.`
              )
            }
          />
        </p>
      </div>
      <MindSparks
        totalClassmates={children}
        step={sparkStep}
        setStep={setSparkStep}
      />
      {explanation && (
        <Explanation text={explanation} onClose={() => setExplanation(null)} />
      )}
    </div>
  );
};

// Wrap the App component with DndProvider
const AppWithDnd = () => (
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>
);

export default AppWithDnd;
