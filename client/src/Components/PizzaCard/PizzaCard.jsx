import { useState } from "react";

import {
  TextField,
  Typography,
  Button,
  Box,
  InputLabel,
  MenuItem,
  Paper,
  Chip
} from "@mui/material";
import Select from "react-select";
import { FormModal } from "../../Components";
import { api } from "../../api";
import pizzaImg from "../../assets/pizza.jpg"

export default function PizzaCard({
  name,
  description,
  completeToppingsData,
  options,
  pizzaId,
}) {
  const [pizzaName, setPizzaName] = useState(name);
  const [pizzaDescription, setPizzaDescription] = useState(description);
  const [pizzaToppings, setPizzaToppings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const formContent = () => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Typography variant="body1">Pizza Name</Typography>
        <TextField
          type="text"
          variant="outlined"
          onChange={(e) => setPizzaName(e.target.value)}
          value={pizzaName}
        />
        <Typography variant="body1">Description</Typography>
        <TextField
          multiline
          rows={4}
          variant="outlined"
          onChange={(e) => setPizzaDescription(e.target.value)}
          value={pizzaDescription}
        />
        <Typography variant="body1">Current Toppings</Typography>
        <Typography>
          {completeToppingsData
            .map((topping, index) => topping.name)
            .join(", ")}
        </Typography>
        <InputLabel>Choose toppings</InputLabel>
        <Select
          isMulti
          // TODO: Find a way to show existing toppings inside select components
          //   defaultValue={pizzaToppings}
          onChange={(values) =>
            setPizzaToppings(values.map((selected) => selected.value))
          }
          options={options.map((topping) => {
            return { value: topping._id, label: topping.name };
          })}
        />
        <Button variant="contained" onClick={editPizza}>
          Update
        </Button>
        <Button variant="contained" onClick={deletePizza}>
          Delete
        </Button>
      </Box>
    );
  };
  const editPizza = async () => {
    const body = {
      name: pizzaName,
      description: pizzaDescription,
      toppings: pizzaToppings,
    };
    if (pizzaToppings.length === 0) {
      delete body.toppings;
    }
    const options = {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(`${api}/pizzas/${pizzaId}`, options);
    try {
      // response.json().then((newPizza) => console.log(newPizza));

      // TODO: trigger refetch
      if (response.ok) {
        setModalOpen(false);
      }
    } catch (err) {}
  };

  const deletePizza = async () => {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(`${api}/pizzas/${pizzaId}`, options);

    try {
      // TODO: trigger refetch
      if (response.ok) {
        setModalOpen(false);
      }
    } catch (err) {}
  };
  return (
    <Paper
      onClick={() => setModalOpen(true)}
      elevation={5}
      sx={{
        display: "flex",
        // flexDirection: { xs: "row", md: "column" },
        flexDirection: "column" ,
        // justifyContent: "space-between", 
        alignItems: "center",
        width: { xs: 1, lg: "23%" },
        py: 2,
        px: 4,
        my: 2,
        borderRadius: "8px",
        "&:hover": {
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
        },
      }}
    >

    <Box onClick={() => setModalOpen(true)}>
    <img src={pizzaImg} alt="" style={{ maxWidth: '100%', borderRadius: '8px' }} />
      <Typography variant="h4" sx={{mt:1, fontWeight: "bold"}}>{name}</Typography>
      <Typography sx={{my:2 }}>{description}</Typography>
      {completeToppingsData.map((topping, index) => {
        return <Chip key={index} label={topping.name} variant="outlined" color="primary" sx={{mr:1, my:1}}/>;
      })}
      <FormModal
        formContent={formContent}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </Box>
    </Paper>
  );
}