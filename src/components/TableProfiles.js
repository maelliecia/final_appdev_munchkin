import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Table } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import TableEmpty from './TableEmpty';

const TableProfiles = () => {
  const [toddlers, setToddlers] = useState([]);

  const fetchToddlers = async () => {
    try {
      const { data, error } = await supabase
        .from('toddlers')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      const userIDs = data.map(toddler => toddler.userID);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, firstname, lastname')
        .in('id', userIDs);

      if (userError) {
        throw userError;
      }

      const toddlersWithUserData = data.map(toddler => {
        const userDataItem = userData.find(user => user.id === toddler.userID);
        const userFullName = userDataItem ? `${userDataItem.firstname} ${userDataItem.lastname}` : '';
        return {
          ...toddler,
          user: userFullName,
        };
      });

      setToddlers(toddlersWithUserData);
    } catch (error) {
      console.error('Error fetching toddlers:', error.message);
    }
  };

  useEffect(() => {
    fetchToddlers();
  }, []);

  return (
    <div className="admin mt-4">
      {toddlers.length > 0 ? (
        <>
          <Table responsive striped bordered hover variant="light" className="table-auto mb-5">
            <thead>
              <tr className="text-center align-items-center">
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Weight (kg)</th>
                <th>Height (cm)</th>
                <th>Requirements</th>
                <th>Allergies</th>
                <th>Preferences</th>
                <th>User (Parent)</th>
              </tr>
            </thead>

            <tbody>
              {toddlers.map((toddler) => (
                <tr key={toddler.id}>
                  <td>{toddler.id}</td>
                  <td>{toddler.name}</td>
                  <td>{toddler.age}</td>
                  <td>{toddler.gender}</td>
                  <td>{toddler.weight_kg}</td>
                  <td>{toddler.height_cm}</td>
                  <td>{toddler.requirements}</td>
                  <td>{toddler.allergies ? toddler.allergies : 'N/A'}</td>
                  <td>{toddler.preferences}</td>
                  <td>{toddler.user}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <TableEmpty />
      )}  
    </div>
  );
};

export default TableProfiles;