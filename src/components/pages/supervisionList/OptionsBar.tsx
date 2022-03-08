import React from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import "./OptionsBarStyling.css";

interface OptionsBarProps {
  selectedSupervisionAmount: number;
  setFromDate: (fromDate: string) => void;
  setToDate: (toDate: string) => void;
  setSortBy: (sortBy: string) => void;
  setIsDescendingSort: (isDescending: boolean) => void;
  isDescendingSort: boolean;
  handleSingleMapClicked: () => void;
  handleMultiMapClicked: () => void;
  handleDeleteClicked: () => void;
  handleReportClicked: () => void;
}

const OptionsBar: React.FC<OptionsBarProps> = ({
  selectedSupervisionAmount,
  setFromDate,
  setToDate,
  setSortBy,
  setIsDescendingSort,
  isDescendingSort,
  handleSingleMapClicked,
  handleMultiMapClicked,
  handleDeleteClicked,
  handleReportClicked,
}) => {
  return (
    <Stack
      spacing={{ xs: 2, sm: 2, md: 2, lg: "auto" }}
      direction={{ xs: "column", sm: "column", md: "column", lg: "row" }}
      divider={
        <Divider
          orientation="vertical"
          style={{ background: "#AAAAAA" }}
          flexItem
        />
      }
      style={{
        marginTop: "15px",
        marginLeft: "51px",
        marginRight: "51px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        <TextField
          style={{ minWidth: 200, backgroundColor: "#FFFFFF" }}
          label="Fra dato"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          onChange={(e) => setFromDate(e.target.value)}
        />

        <TextField
          style={{ width: 200, backgroundColor: "#FFFFFF" }}
          label="Til dato"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      <div
        style={{
          marginTop: "auto",
          marginBottom: "auto",
          display: "flex",
          flexDirection: "row",
          gap: "5px",
        }}
      >
        <FormControl
          style={{
            width: 200,
            marginTop: "auto",
            marginBottom: "auto",
            backgroundColor: "#FFFFFF",
          }}
        >
          <InputLabel id="sort-label-id">Sorter etter</InputLabel>
          <Select
            labelId="sort-label-id"
            id="sort-by-field"
            label="Sorter etter"
            // @ts-ignore
            onChange={(e) => setSortBy(e.target.value)}
            defaultValue={"tilsynsdato"}
          >
            <MenuItem value={"tilsynsdato"}>Tilsynsdato</MenuItem>
            <MenuItem value={"observasjoner"}>Antall observasjoner</MenuItem>
            <MenuItem value={"varighet"}>Varighet</MenuItem>
          </Select>
        </FormControl>
        <IconButton
          size="large"
          onClick={() => setIsDescendingSort(!isDescendingSort)}
        >
          {!isDescendingSort && (
            <ArrowUpwardIcon fontSize="inherit"></ArrowUpwardIcon>
          )}
          {isDescendingSort && (
            <ArrowDownwardIcon fontSize="inherit"></ArrowDownwardIcon>
          )}
        </IconButton>
      </div>
      <Stack spacing={3} direction="row">
        <Stack spacing={1} direction="column">
          <Button
            variant="outlined"
            size="large"
            color="success"
            style={{ backgroundColor: "#FFFFFF" }}
            onClick={handleSingleMapClicked}
            disabled={selectedSupervisionAmount <= 0}
          >
            Vis samlet på ett kart
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="success"
            style={{ backgroundColor: "#FFFFFF" }}
            onClick={handleMultiMapClicked}
            disabled={selectedSupervisionAmount <= 1}
          >
            Vis på ett kart per tur
          </Button>
        </Stack>

        <Stack spacing={1} direction="column">
          <Button
            variant="outlined"
            size="large"
            color="info"
            style={{ backgroundColor: "#FFFFFF" }}
            disabled={selectedSupervisionAmount <= 0}
            onClick={handleReportClicked}
          >
            Last ned rapport
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="error"
            style={{ backgroundColor: "#FFFFFF" }}
            disabled={selectedSupervisionAmount <= 0}
            onClick={handleDeleteClicked}
          >
            {selectedSupervisionAmount > 1
              ? "Slett valgte turer"
              : "Slett valgt tur"}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OptionsBar;
