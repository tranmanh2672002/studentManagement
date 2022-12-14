import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import axios from "axios";

import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

function StudentManagement() {
  const [rows, setRows] = useState([]);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);

  // Get data
  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("http://localhost:3000/students");
      setRows(res.data);
    };
    getData();
  }, []);

  // ValidatorForm
  useEffect(() => {
    ValidatorForm.addValidationRule("idRegister", (value) => {
      let result = rows.find((row) => {
        return row.id === Number(value);
      });
      console.log(result);
      if (result) {
        return false;
      }
      return true;
    });
  }, [rows]);

  useEffect(() => {
    ValidatorForm.addValidationRule("length8", (value) => {
      if (value.length === 8) {
        return true;
      }
      return false;
    });
  }, []);

  useEffect(() => {
    ValidatorForm.addValidationRule("maxLength100", (value) => {
      if (value.length < 100) {
        return true;
      }
      return false;
    });
  }, []);

  useEffect(() => {
    ValidatorForm.addValidationRule("isBirthday", (d) => {
      var s = d.split("/");

      if (s.length !== 3) return false; //phai co 3 phan
      if (isNaN(s[0]) || isNaN(s[1]) || isNaN(s[2])) return false; //ca 3 la so

      //chuyen thanh cac so nguyen
      let ngay = parseInt(s[0]);
      let thang = parseInt(s[1]);
      let nam = parseInt(s[2]);

      //kiem tra
      if (thang > 12 || thang < 1) return false;
      if (
        thang === 1 ||
        thang === 3 ||
        thang === 5 ||
        thang === 7 ||
        thang === 8 ||
        thang === 10 ||
        thang === 12
      ) {
        if (ngay > 31) return false;
      } else if (thang === 2) {
        if (nam % 4 === 0 && nam % 100 !== 0) {
          if (ngay > 29) return false;
        } else if (ngay > 28) return false;
      } else if (ngay > 30) return false;

      if (ngay < 1) return false;

      let date = new Date();
      if (nam > date.getFullYear() || nam < 1950) return false;

      return true;
    });
  }, []);

  // //////////////////////////////////////////////////////////////////////////

  const handleClickCreate = async () => {
    try {
      const res = await axios.post("http://localhost:3000/students", {
        id: Number(id),
        name: name,
        birthday: birthday,
        address: address,
      });
      if (res) {
        alert("Create was successful");
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/students/${id}`, {
        name: name,
        birthday: birthday,
        address: address,
      });
      if (res) {
        alert("Update was successful");
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickDelete = async () => {
    try {
      const res = await axios.delete(`http://localhost:3000/students/${id}`);
      if (res) {
        alert("Delete was successful");
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <>
      <Box sx={{ margin: "20px 40px" }}>
        <Typography sx={{margin: '20px 0', color: '#444', fontWeight:'500'}} variant="h4" >H??? th???ng qu???n l?? sinh vi??n</Typography>
        <Button
          onClick={() => {
            setId("");
            setName("");
            setBirthday("");
            setAddress("");
            setOpenModalCreate(true);
          }}
          sx={{ marginBottom: "10px" }}
          variant="contained"
        >
          Th??m m???i
        </Button>
        <TableContainer component={Paper}>
          <Table
            sx={{ maxWidth: "100%" }}
            size="small"
            aria-label="caption table"
          >
            <TableHead>
              <TableRow>
                <TableCell align="left">STT</TableCell>
                <TableCell align="left">MSSV</TableCell>
                <TableCell align="left">H??? v?? t??n</TableCell>
                <TableCell align="left">Ng??y sinh</TableCell>
                <TableCell align="left">Qu?? qu??n</TableCell>
                <TableCell align="center">S???a</TableCell>
                <TableCell align="center">X??a</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell align="left">{row.id}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.birthday}</TableCell>
                  <TableCell align="left">{row.address}</TableCell>
                  <TableCell align="center">
                    <Button onClick={() => {
                      setId(row.id);
                      setName(row.name);
                      setBirthday(row.birthday);
                      setAddress(row.address);
                      setOpenModalUpdate(true);
                    }} variant="contained" color="secondary">
                      S???a
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        setId(row.id);
                        setOpenModalDelete(true);
                      }}
                    >
                      X??a
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* Modal Create */}
      <Modal
        keepMounted
        open={openModalCreate}
        onClose={() => {
          setOpenModalCreate(false);
        }}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Th??m sinh vi??n m???i
          </Typography>
          <ValidatorForm
            className="wrapper__left-content"
            onSubmit={handleClickCreate}
          >
            <TextValidator
              sx={{ margin: "6px 0" }}
              className="login__input"
              value={id}
              type="number"
              fullWidth
              label="M?? sinh vi??n"
              variant="standard"
              validators={["required", "length8", "idRegister"]}
              errorMessages={[
                "Vui l??ng nh???p m?? sinh vi??n",
                "M?? sinh vi??n g???m 8 s???",
                "MSSV ???? t???n t???i",
              ]}
              onChange={(e) => setId(e.target.value)}
            />
            <TextValidator
              sx={{ margin: "6px 0" }}
              className="login__input"
              value={name}
              type="text"
              autoComplete="off"
              fullWidth
              label="H??? v?? t??n"
              variant="standard"
              validators={["required", "maxLength100"]}
              errorMessages={["Vui l??ng nh???p h??? t??n", "Nh???p t???i ??a 100 k?? t???"]}
              onChange={(e) => setName(e.target.value)}
            />
            <TextValidator
              sx={{ margin: "6px 0" }}
              className="login__input"
              value={birthday}
              type="text"
              autoComplete="off"
              fullWidth
              label="Ng??y sinh"
              variant="standard"
              validators={["required", "isBirthday"]}
              errorMessages={[
                "Vui l??ng nh???p ng??y sinh",
                "Ng??y sinh kh??ng h???p l???",
              ]}
              onChange={(e) => setBirthday(e.target.value)}
            />
            <TextValidator
              sx={{ margin: "6px 0" }}
              className="login__input"
              value={address}
              type="text"
              autoComplete="off"
              fullWidth
              id="login-password"
              label="Qu?? qu??n"
              variant="standard"
              validators={["required", "maxLength100"]}
              errorMessages={[
                "Vui l??ng nh???p qu?? qu??n",
                "Nh???p t???i ??a 100 k?? t???",
              ]}
              onChange={(e) => setAddress(e.target.value)}
            />

            <Button
              className="login__btn btn-grad"
              fullWidth
              type="submit"
              size="large"
              variant="contained"
            >
              T???o m???i
            </Button>
          </ValidatorForm>
        </Box>
      </Modal>
      {/* Modal Update */}
      <Modal
        keepMounted
        open={openModalUpdate}
        onClose={() => {
          setOpenModalUpdate(false);
        }}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Ch???nh s???a th??ng tin sinh vi??n
          </Typography>
          <ValidatorForm
            className="wrapper__left-content"
            onSubmit={handleClickUpdate}
          >
            <TextValidator
              sx={{ margin: "6px 0" }}
              className="login__input"
              value={name}
              type="text"
              autoComplete="off"
              fullWidth
              label="H??? v?? t??n"
              variant="standard"
              validators={["required", "maxLength100"]}
              errorMessages={["Vui l??ng nh???p h??? t??n", "Nh???p t???i ??a 100 k?? t???"]}
              onChange={(e) => setName(e.target.value)}
            />
            <TextValidator
              sx={{ margin: "6px 0" }}
              className="login__input"
              value={birthday}
              type="text"
              autoComplete="off"
              fullWidth
              label="Ng??y sinh"
              variant="standard"
              validators={["required", "isBirthday"]}
              errorMessages={[
                "Vui l??ng nh???p ng??y sinh",
                "Ng??y sinh kh??ng h???p l???",
              ]}
              onChange={(e) => setBirthday(e.target.value)}
            />
            <TextValidator
              sx={{ margin: "6px 0" }}
              className="login__input"
              value={address}
              type="text"
              autoComplete="off"
              fullWidth
              id="login-password"
              label="Qu?? qu??n"
              variant="standard"
              validators={["required", "maxLength100"]}
              errorMessages={[
                "Vui l??ng nh???p qu?? qu??n",
                "Nh???p t???i ??a 100 k?? t???",
              ]}
              onChange={(e) => setAddress(e.target.value)}
            />

            <Button
              className="login__btn btn-grad"
              fullWidth
              type="submit"
              size="large"
              variant="contained"
            >
              T???o m???i
            </Button>
          </ValidatorForm>
        </Box>
      </Modal>
      {/* Modal Delete */}
      <Modal
        keepMounted
        open={openModalDelete}
        onClose={() => {
          setOpenModalDelete(false);
        }}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            B???n c?? th???c s??? mu???n x??a ?
          </Typography>
          <Box sx={{marginTop: '20px', display: 'flex', justifyContent: 'right'}}>
            <Button onClick={() => setOpenModalDelete(false)} variant="contained">H???y</Button>
            <Button onClick={handleClickDelete} sx={{marginLeft: '10px'}} variant="contained" color='error'>X??a</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default StudentManagement;
