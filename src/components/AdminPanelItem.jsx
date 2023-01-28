import { useState, useRef, useContext } from "react";
import {
	dellUserFunction,
	editUserFunction,
	getLocationsByName,
} from "../firebase/utils/functions";
import {
	MDBBtn,
	MDBIcon,
	MDBModal,
	MDBModalDialog,
	MDBModalContent,
	MDBModalHeader,
	MDBModalTitle,
	MDBModalBody,
	MDBModalFooter,
  MDBInput,
  MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem 
} from "mdb-react-ui-kit";
import styled from "styled-components";
import { MenuContent } from "./StateContainer";

const EmployeeDiv = styled.div`
	font-size: 12px;
`;

export const AdminPanelItem = ({ user }) => {
	const [deleteModalState, setDeleteModalState] = useState(false);
	const [editModalState, setEditModalState] = useState(false);
	const inputEditUserName = useRef();
  const inputEditUserLastName = useRef();
  
  const [newLocation, setNewLocation] = useState(false)

	const context = useContext(MenuContent);

	const deleteModalToggle = () => setDeleteModalState(!deleteModalState);

	const editModalToggle = user => {
		setEditModalState(!editModalState);
		if (!editModalState) {
			inputEditUserName.current.value = user.name;
			inputEditUserName.current.placeholder = "";
			inputEditUserLastName.current.value = user.lastName;
			inputEditUserLastName.current.placeholder = "";
		}
	};

	const deleteUser = id => {
		dellUserFunction(id);
		deleteModalToggle();
	};

	const editUser = id => {
		const newName = inputEditUserName.current.value;
    const newLastName = inputEditUserLastName.current.value;
    const locationId = newLocation
		//editUserFunction({ id: id, name: newName, lastName: newLastName, locationId:locationId });
    editModalToggle();
    
	};

	return (
		<EmployeeDiv key={user.id}>
			{user.name} {user.lastName}
			<button className="edit bsmall" onClick={() => editModalToggle(user)}>
				<MDBIcon icon="edit" />
			</button>
			<>
				<MDBModal
					tabIndex="-1"
					show={editModalState}
					setShow={setEditModalState}>
					<MDBModalDialog centered>
						<MDBModalContent className="bg-warning bg-gradient">
							<MDBModalHeader>
								<MDBModalTitle>Edycja usera</MDBModalTitle>
								<MDBBtn
									className="btn-close"
									color="orange"
									onClick={() => editModalToggle(user)}></MDBBtn>
							</MDBModalHeader>
							<MDBModalBody>
								Imie
								<MDBInput
									ref={inputEditUserName}
									type="text"
									className="bg-light bg-gradient"
								/>
							</MDBModalBody>
							<MDBModalBody>
								Nazwisko
								<MDBInput
									ref={inputEditUserLastName}
									type="text"
									className="bg-light bg-gradient"
								/>
								<MDBDropdown>
                  <MDBDropdownToggle>{context.location.name }</MDBDropdownToggle>
                  <MDBDropdownMenu>
                    
                    {context.locations.map(location => {
                      
                      return (
                        
                        <MDBDropdownItem key={location.id} onClick={() =>
                        {
                        setNewLocation(location.id)
                        }}
                          
                      
                      link>{location.name}</MDBDropdownItem>
                    )})}
                    
										
									</MDBDropdownMenu>
								</MDBDropdown>
							</MDBModalBody>
							<MDBModalFooter>
								<MDBBtn color="secondary" onClick={() => editModalToggle(user)}>
									Anuluj
								</MDBBtn>
								<MDBBtn
									color="success"
									id={user.id}
									onClick={() => editUser(user.id)}>
									Zapisz
								</MDBBtn>
							</MDBModalFooter>
						</MDBModalContent>
					</MDBModalDialog>
				</MDBModal>
			</>
			<button className="edit bsmall" onClick={deleteModalToggle}>
				<MDBIcon icon="trash" />
			</button>
			<>
				<MDBModal
					tabIndex="-1"
					show={deleteModalState}
					setShow={setDeleteModalState}>
					<MDBModalDialog centered>
						<MDBModalContent className="bg-danger bg-gradient">
							<MDBModalHeader>
								<MDBModalTitle>Czy na pewno</MDBModalTitle>
								<MDBBtn
									className="btn-close"
									color="orange"
									onClick={deleteModalToggle}></MDBBtn>
							</MDBModalHeader>

							<MDBModalFooter className="justify-content-center">
								<MDBBtn color="secondary" onClick={deleteModalToggle}>
									Anuluj
								</MDBBtn>
								<MDBBtn
									color="success gradient"
									onClick={() => {
										deleteUser(user.id);
									}}>
									Usuń
								</MDBBtn>
							</MDBModalFooter>
						</MDBModalContent>
					</MDBModalDialog>
				</MDBModal>
			</>
		</EmployeeDiv>
	);
};