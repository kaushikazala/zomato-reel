import React , {useState,useEffect} from 'react'
import './profile.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { useCart } from '../../context/CartContext'
  

const Profile = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setprofile] = useState(null)
  const [videos, setVideos] = useState([])

  const { partnerId: cartPartnerId, itemsById, totalItems, addItem, setQty, clearCart } = useCart()

  const getQty = (foodId) => itemsById?.[foodId]?.quantity || 0

  const ensurePartnerCart = () => {
    if (cartPartnerId && cartPartnerId !== id) {
      const ok = window.confirm(
        'Your cart has items from a different food partner. Clear cart and start a new order?'
      )
      if (!ok) return false
      clearCart()
    }
    return true
  }

  const handleAdd = (food) => {
    if (!ensurePartnerCart()) return

    addItem({
      partnerId: id,
      item: {
        foodId: food._id,
        name: food.name,
        video: food.video,
        description: food.description,
        // Price not implemented in backend yet; keep field for future.
        priceCents: typeof food.priceCents === 'number' ? food.priceCents : undefined,
      },
    })
  }
  
   useEffect(() => {
    axios.get(`${API_URL}/api/food-partner/${id}`, { withCredentials: true })
      .then(response => {
        setprofile(response.data.foodPartner)
        setVideos(response.data.foodPartner.foodItems || [])
      })
      .catch(error => {
        console.error('Error fetching business data:', error)
      })
   }, [id])
   

    if (!profile) {
    return <p>Loading profile...</p>;  // prevents crash
  }
  return (
    <div className="profile-container">
      {/* Business Header Section */}
      <div className="business-header">
        <div className="header-top">
          <div className="profile-circle">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt="Business" />
            ) : (
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF02Jj8T2t7PdkytAw42HDuuSz7yXguKn8Lg&s" alt="Default Business" />
            )}
          </div>
          <div className="business-info">
            <div className="info-item">
              <h2 className="business-name">{profile.ownerName}</h2>
            </div>
            <div className="info-item">
              <p className="business-address">{profile.address}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <p className="stat-label">total meals</p>
            <p className="stat-value">{profile.totalMeals}</p>
          </div>
          <div className="stat-item">
            <p className="stat-label">customer serve</p>
            <p className="stat-value">{profile.customerServe}</p>
          </div>
        </div>
      </div>

      {/* Videos Grid Section */}
      <div className="videos-section">
        <div className="videos-grid">
          {videos.map((video) => {
            const qty = getQty(video._id)

            return (
              <div key={video._id} className="video-item">
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <video
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    src={video.video}
                    muted
                    playsInline
                  />

                  {/* Simple overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 8,
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.05))',
                      color: '#fff',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {video.name}
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.85 }}>
                        {video.description}
                      </div>
                    </div>

                    {qty > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (!ensurePartnerCart()) return
                            setQty({ foodId: video._id, quantity: qty - 1 })
                          }}
                          style={{ padding: '4px 10px', borderRadius: 8 }}
                        >
                          -
                        </button>
                        <div style={{ minWidth: 20, textAlign: 'center', fontWeight: 700 }}>{qty}</div>
                        <button
                          type="button"
                          onClick={() => {
                            if (!ensurePartnerCart()) return
                            setQty({ foodId: video._id, quantity: qty + 1 })
                          }}
                          style={{ padding: '4px 10px', borderRadius: 8 }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAdd(video)}
                        style={{ padding: '6px 12px', borderRadius: 10, fontWeight: 700 }}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sticky CTA */}
      {(!cartPartnerId || cartPartnerId === id) && totalItems > 0 ? (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            padding: 12,
            background: 'rgba(0,0,0,0.92)',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            zIndex: 999,
          }}
        >
          <div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Selected items</div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{totalItems}</div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/food-partner/${id}/order`)}
            style={{ padding: '10px 14px', borderRadius: 10, fontWeight: 800 }}
          >
            Order Food
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default Profile
