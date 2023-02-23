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
    display: "flex", // Ajouter un display flex pour aligner les éléments
    alignItems: "center", // Centrer verticalement les éléments
    justifyContent: "center", // Centrer horizontalement les éléments
    border: "1px solid black",
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
        alignItems: "center",
        justifyContent: "center",
        minWidth: "fit-content",
        position: "relative",
        margin: "0",
        backgroundColor: "grey",
        opacity: "0.9",
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
