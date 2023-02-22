import React from "react";

function MenuVisite(props) {
  const { items, onDateSelect } = props;

  if (!items) {
    return null;
  }

  const itemStyle = {
    height: "calc(100% / " + items.length + ")",
    width: "fit-content",
    cursor: "pointer", // Ajouter un curseur pour indiquer que l'élément est cliquable
  };

  const handleItemClick = (item) => {
    // Appeler la fonction de rappel onDateSelect avec l'item cliqué
    onDateSelect(item);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: "fit-content",
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "10",
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={itemStyle}
          onClick={() => handleItemClick(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default MenuVisite;
