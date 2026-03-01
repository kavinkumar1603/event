import { createContext, useContext, useState, useEffect } from 'react';
import { EventStatus, ODRequestStatus } from '../types';
import {
  fetchEvents,
  fetchStudents,
  fetchODRequests,
  createEvent as createEventInDB,
  updateEventStatus,
  createODRequest as createODRequestInDB,
  updateODRequestStatus,
  subscribeToEvents,
  subscribeToODRequests,
  subscribeToStudents,
} from '../services/firebaseService';

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [odRequests, setODRequests] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedODRequest, setSelectedODRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [organizerRequests, setOrganizerRequests] = useState([
    { id: 's2', name: 'Jane Smith', status: 'pending' }
  ]);

  // Subscribe to real-time updates from Firebase
  useEffect(() => {
    setLoading(true);
    
    // Subscribe to events
    const unsubscribeEvents = subscribeToEvents((fetchedEvents) => {
      setEvents(fetchedEvents);
    });

    // Subscribe to OD requests
    const unsubscribeOD = subscribeToODRequests((fetchedOD) => {
      setODRequests(fetchedOD);
    });

    // Subscribe to students
    const unsubscribeStudents = subscribeToStudents((fetchedStudents) => {
      setStudents(fetchedStudents);
      setLoading(false);
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeEvents();
      unsubscribeOD();
      unsubscribeStudents();
    };
  }, []);

  const handleLogin = (user) => setCurrentUser(user);
  
  const handleLogout = () => {
    setCurrentUser(null);
  };

  const createEvent = async (newEvent) => {
    try {
      const createdEvent = await createEventInDB({
        ...newEvent,
        status: EventStatus.PENDING_FACULTY,
      });
      return createdEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const handleApproval = async (eventId, approve) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    let newStatus;
    if (!approve) {
      newStatus = EventStatus.REJECTED;
    } else {
      switch (event.status) {
        case EventStatus.PENDING_FACULTY:
          newStatus = EventStatus.PENDING_HOD;
          break;
        case EventStatus.PENDING_HOD:
          newStatus = EventStatus.PENDING_PRINCIPAL;
          break;
        case EventStatus.PENDING_PRINCIPAL:
          newStatus = EventStatus.APPROVED;
          break;
        default:
          return;
      }
    }

    try {
      await updateEventStatus(eventId, newStatus);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  // OD Request functions
  const createODRequest = async (odData) => {
    try {
      const createdOD = await createODRequestInDB(odData);
      return createdOD;
    } catch (error) {
      console.error('Error creating OD request:', error);
      throw error;
    }
  };

  const handleODApproval = async (requestId, approve, approverInfo = {}) => {
    const request = odRequests.find(r => r.id === requestId);
    if (!request) return;

    let newStatus;
    if (!approve) {
      newStatus = ODRequestStatus.REJECTED;
    } else {
      switch (request.status) {
        case ODRequestStatus.PENDING_FACULTY:
          newStatus = ODRequestStatus.PENDING_HOD;
          break;
        case ODRequestStatus.PENDING_HOD:
          newStatus = ODRequestStatus.PENDING_PRINCIPAL;
          break;
        case ODRequestStatus.PENDING_PRINCIPAL:
          newStatus = ODRequestStatus.APPROVED;
          break;
        default:
          return;
      }
    }

    try {
      await updateODRequestStatus(requestId, newStatus, {
        [`${request.status.replace('PENDING_', '').toLowerCase()}ApprovedBy`]: approverInfo.name,
        [`${request.status.replace('PENDING_', '').toLowerCase()}ApprovedAt`]: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating OD request:', error);
    }
  };

  const approveOrganizer = (studentId) => {
    setOrganizerRequests(organizerRequests.map(req => 
      req.id === studentId ? { ...req, status: 'approved' } : req
    ));
  };

  const completeEvent = async (eventId) => {
    try {
      await updateEventStatus(eventId, EventStatus.COMPLETED);
    } catch (error) {
      console.error('Error completing event:', error);
    }
  };

  const value = {
    currentUser,
    events,
    students,
    odRequests,
    selectedEvent,
    selectedODRequest,
    organizerRequests,
    loading,
    setSelectedEvent,
    setSelectedODRequest,
    handleLogin,
    handleLogout,
    createEvent,
    handleApproval,
    createODRequest,
    handleODApproval,
    approveOrganizer,
    completeEvent,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
