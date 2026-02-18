import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {
  const [selectedId, setSelectedId]           = useState(null)
  const [prescriptionText, setPrescriptionText] = useState('')
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState('')

  const { appointments, getAllappointments, dToken, AppointmentComplete, Appointmentcancel } =
    useContext(DoctorContext)
  const { calculateAge, slotsDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) getAllappointments()
  }, [dToken])

  const handleAddPrescription = async (appointmentId) => {
    if (!prescriptionText.trim()) {
      setError('Prescription cannot be empty.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/doctor/add-prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${dToken}`,   // ← send token in header
        },
        body: JSON.stringify({ appointmentId, prescription: prescriptionText }),
      })
      const data = await res.json()
      if (data.success) {
        setPrescriptionText('')
        setSelectedId(null)
        getAllappointments()
      } else {
        setError(data.message || 'Failed to save prescription.')
      }
    } catch (err) {
      console.error(err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full m-5 max-w-6xl">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">

        {/* Header */}
        <div className="max-sm:hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr_1fr] py-3 px-6 border-b font-semibold text-gray-700 bg-gray-50">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Prescription</p>
          <p>Fees</p>
          <p>Payment</p>
          <p>Action</p>
        </div>

        {appointments.length === 0 && (
          <p className="text-center py-10 text-gray-400">No appointments found.</p>
        )}

        {appointments.slice().reverse().map((item, index) => (
          <div
            key={item._id}
            className="flex flex-wrap justify-between max-sm:gap-5 sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr_1fr] gap-2 items-start text-gray-600 py-3 px-6 border-b hover:bg-gray-50 transition-colors"
          >
            <p className="max-sm:hidden pt-1">{index + 1}</p>

            {/* Patient */}
            <div className="flex items-center gap-2 pt-1">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={item.userData?.image || '/default.png'}
                alt=""
              />
              <p>{item.userData?.name}</p>
            </div>

            <p className="max-sm:hidden pt-1">{calculateAge(item.userData?.dob)}</p>

            <p className="pt-1">{slotsDateFormat(item.slotDate)}, {item.slotTime}</p>

            {/* Prescription */}
            <div>
              {item.prescription ? (
                <div className="flex items-start gap-1">
                  <span className="text-green-600 text-xs font-medium">✓</span>
                  <p className="text-green-700 text-xs break-words">{item.prescription}</p>
                </div>
              ) : item.cancelled ? (
                <p className="text-gray-400 text-xs italic">N/A</p>
              ) : selectedId === item._id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={prescriptionText}
                    onChange={(e) => { setPrescriptionText(e.target.value); setError('') }}
                    className="border border-gray-300 p-1.5 rounded text-xs w-full resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                    rows={3}
                    placeholder="Enter prescription details..."
                    autoFocus
                  />
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddPrescription(item._id)}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      {loading ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setSelectedId(null); setPrescriptionText(''); setError('') }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setSelectedId(item._id); setPrescriptionText('') }}
                  className="text-blue-500 hover:text-blue-700 underline text-xs"
                >
                  + Add Prescription
                </button>
              )}
            </div>

            <p className="pt-1">{currency}{item.amount}</p>

            <div className="pt-1">
              <span className="text-xs border border-primary px-2 py-0.5 rounded-full">
                {item.payment ? 'Online' : 'Cash'}
              </span>
            </div>

            {/* Action */}
            <div className="pt-1">
              {item.cancelled ? (
                <p className="text-red-500 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
              ) : (
                <div className="flex gap-2">
                  <img
                    onClick={() => Appointmentcancel(item._id)}
                    className="w-8 cursor-pointer hover:scale-110 transition-transform"
                    src={assets.cancel_icon}
                    alt="Cancel"
                    title="Cancel appointment"
                  />
                  <img
                    onClick={() => AppointmentComplete(item._id)}
                    className="w-8 cursor-pointer hover:scale-110 transition-transform"
                    src={assets.tick_icon}
                    alt="Complete"
                    title="Mark complete"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorAppointments