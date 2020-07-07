import React, { useState, useRef, useEffect } from 'react'
import './AddAppointments.css'
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from '../button'
import { db, auth } from '../firebase/firebase'
import { MDBIcon } from "mdbreact";
import { useTranslation } from 'react-i18next';
import i18next, {dir} from 'i18next';
import TextField from '@material-ui/core/TextField'
import AppointmentList from '../appointmentsList/appointmenstList';


//TODO: disable past dates, minor modifications to css, SMS, fix issue with first entry for bloodtype

export default function AddAppointments() {

    const { t } = useTranslation();
    const [visible, setVisible] = useState(false)

    const [hospitalsDetails, setHospitalsDetails] = useState([])
    useEffect(()=>{
        //load hospitals into hospitalsList
        const hospitals = []
        db.collection('Hospitals').get()
            .then(snapshot => {
                snapshot.docs.forEach(hospital => {
                    let currentID = hospital.id
                    let appObj = { ...hospital.data(), ['id']: currentID }
                    hospitals.push(appObj)
            })
            setHospitalsDetails(hospitals)
            console.log(hospitalsDetails)
        })
    },[])

    const [appList, setAppList] = useState([])
    const [appDate, setAppDate] = useState(new Date())
    const displayNode = useRef(null)
    const [currentApp, setCurrentApp] = useState({
        userID: null,
        hospitalName: null, 
        hospitalID: null,
        date: null,
        time: null,
        timestamp: null,
        slots: 1,
        appointmentType: null
    })

    //for counted appointments added
    let count = 0;

    //set state values for slots & hospital
    const handleChange = (e) => {
        setCurrentApp({ ...currentApp, [e.target.id]: e.target.value})
        console.log(currentApp)
    }
    // initialize Granulocytes state 
    const [appointmentTypeDetails, setAppointmentTypeDetails] =  useState({
        Granulocytes: {
            bloodType:null,
            message: "Default message"
        }
    })

    const handleATChange = (e) => {
        //Hide/show appointment type
        //HINT if Thrombocytes is selected then it will be added to the state
        //if Granulocytes is selected a new component will show and handle the change 
        if (e.target.value === 'Thrombocytes'){
            setVisible(false)
            setCurrentApp({ ...currentApp, [e.target.id]: e.target.value})
        }else{
            setVisible(true)
            setCurrentApp({ ...currentApp, [e.target.id]: null})
        }
    }

    const handleGranChange = (e) => {
        //handle Granulocytes appointments
        setAppointmentTypeDetails({...appointmentTypeDetails, Granulocytes : {
            ...appointmentTypeDetails.Granulocytes, 
            [e.target.id] : e.target.value}
        })
        //add Granulocytes details to currentApp state
        setCurrentApp({ ...currentApp, ['appointmentType'] : appointmentTypeDetails  })

        console.log(currentApp)
    }

    const handleChangeHospital = (e) => {
        //setting hospital ID vs Passing it as props from options
        const hospital = hospitalsDetails.filter(obj => obj.hospitalName === e.target.value)
        setCurrentApp({ ...currentApp, [e.target.id]: e.target.value, ['hospitalID'] : hospital[0].id})  
    }

    //set state values for date
    const handleChangeDate = date => {
        setAppDate(date)
        console.log(date)
        let fullDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
        let minutes = date.getMinutes()
        if (minutes == 0) {
            minutes = "00"
        }
        let time = `${date.getHours()}:${minutes}`


        let timestamp = new Date(`${date.getMonth() + 1} ${date.getDate()}, ${date.getFullYear()}, ${time}`);

        setCurrentApp({ ...currentApp, ["date"]: fullDate, ["time"]: time, ["timestamp"]: timestamp })
    }

    //add new Appointment to appoitnment list
    const handleAdd = () => {
        if (!currentApp.date || !currentApp.time || !currentApp.slots || !currentApp.hospitalName || !currentApp.appointmentType) return 

        //BloodType and message validation 
        if(currentApp.appointmentType!=='Thrombocytes'){
        if(!appointmentTypeDetails.Granulocytes.bloodType || !appointmentTypeDetails.Granulocytes.message)
               return
       
        }
        setAppList(appList.concat(currentApp))
        displayNode.current.textContent = ""
        console.log(appList)
    }

    //add free appointments to DB
    const handleSubmit = () => {
        appList.forEach((appointment) => {
            let loops = appointment.slots;
            //loop though and add as many appointments for empty spots
            for (let i = 0; i < loops; i++) {
                db.collection('Appointments').add({ ...appointment, ["slots"]: null })
                count++
            }
            //reset list
            setAppList([])
            //FIXME: fixed messgae when successfully uploaded
            displayNode.current.textContent = `${count} Appointments Successfully Uploaded`

        })
    }

    const handleDelete = (index) => {
        setAppList(appList.filter((item, count) => count !== index));
    }

    return (
        <div className="addAppContainer" style={{width:'100%'}}>
            <div ClassName="addInputs">
            <div className="hospitalDate">
            {/* {t('addAppointments.addAppointmentTitle')}: {" "} */}
            <Datepicker
                    required
                    selected={appDate}
                    onChange={handleChangeDate}
                    showTimeSelect
                    dateFormat="Pp"
                    className="pa2"
                />
                <select className="dropdown ml-3 pa2" id="hospitalName" onChange={handleChangeHospital}>
                <option selected disabled >{t('addAppointments.selectHospital')}</option>
                    {
                    hospitalsDetails.map( hospital => {
                        return <option 
                            value={hospital.hospitalName} 
                            className="option">
                            {hospital.hospitalName} 
                            </option>
                    })  
                    }
                </select>
                
               
            </div>

            <div className="typeSlots">
                <TextField
                id="slots" 
                type="number"
                min={1}
                defaultValue="1"
                className="TextField pa2" 
                onChange={handleChange} 
                label="number of slots" 
                InputProps={{ 
                    inputProps: { min: 1} 
                 }}
                InputLabelProps = {{
                    shrink:true,
                }}/>
                <select 
                 className="dropdown ml-3 pa2" 
                 id="appointmentType" 
                 onChange={handleATChange} >
                    <option selected disabled>{t('addAppointments.selectAppointmentType')}</option>
                    <option id="AppointmentType" value="Thrombocytes" className="option"> {t('general.Thrombocytes')} </option>
                    <option id="AppointmentType" value="Granulocytes" className="option"> {t('general.Granulocytes')}</option>
                 </select>
            </div>

           
                { visible ? (
                     <div className='Gran'>
                    <TextField
                    id="message" 
                    type="text"
                    defaultValue={appointmentTypeDetails.Granulocytes.message}
                    className="TextField pa2 w-80" 
                    onChange={handleGranChange} 
                    label="Message" 
                    InputLabelProps = {{
                        shrink:true,
                    }}/>
                    <select
                    id="bloodType"
                    className="dropdown ml-3 pa2 w-20"
                    onChange={handleGranChange}
                    required>
                    <option value="N/A" disabled selected>
                        Blood type:
                    </option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                </select>
                </div>
                ) : null }
           

            <div className='add'>
                <Button 
                color="yellowgreen"
                className="addBtn text-center mx-3" 
                onClick={handleAdd}
                text={t('addAppointment.add')} >
                </Button>
            </div>
           
            </div>
            <hr/>
             <div className="display ma0">
                {appList.length === 0 ?
                    <div className="text-center">{t('addAppointments.noAppsToSubmit')}</div>
                    :
                    <table className="schedulesTables" style={{overflowX:'unset'}}>
                    <thead>
                    <tr className="headerRow" style={{height:'40px'}}>
                      <th className="headerEntries">{t('general.hospital')}</th>
                      <th className="headerEntries">{t('dashboard.date')}</th>
                      <th className="headerEntries">{t('dashboard.Time')}</th>
                     <th className="headerEntries">Type</th>
                      <th className="headerEntries">Slots</th>
                      <th className="headerEntries">
                          {/* <MDBIcon icon='trash-alt' size="2x"/> */}
                      </th>
                   </tr>
                   </thead>
                   <tbody>
                    {appList.map((appointment, index) => (
                    
                        //  appointment.appointmentType === 'Thrombocytes' ? 
                        //  <tr className='rowContainer bg-yellowgreen' key={index} id={index} style={{height:'60px'}}>
                        //  : 
                        <tr className='rowContainer' key={index} id={index} style={{height:'60px'}}>
                        <td className='rowClass' >{appointment.hospitalName}</td>
                        <td className='rowClass' >{appointment.date}</td>
                        <td className='rowClass'>{appointment.time}</td>
                        <td className='rowClass'>
                            { appointment.appointmentType === 'Thrombocytes' ? 'Thrombocytes' : 
                            <div>
                                Granulocytes 
                                <h5 style={{color:'red'}}>{appointment.appointmentType.Granulocytes.bloodType}</h5>
                            </div>
                            }
                        </td> 
                        <td className='rowClass'>{appointment.slots}</td>
                        <td className='rowClass'>
                            <MDBIcon 
                            icon='trash'
                            size="2x"
                            className="deleteBtn"
                            onClick={() => handleDelete(index)} />
                        </td>
                      </tr>
                     
                    ))}
                   </tbody>
                  </table>
                }
              </div>
                
                    
            <div className="subBtn">
                <Button 
                type="button" 
                text={t('addAppointment.submit')} 
                onClick={handleSubmit}></Button>
                <div ref={displayNode} 
                className="text-center mt-3 msg" 
                style={{ color: "green", fontWeight: "800" }}>
                </div>
            </div>
        </div>

    )
}
