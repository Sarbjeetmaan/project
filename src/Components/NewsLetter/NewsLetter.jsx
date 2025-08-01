import React from 'react'
import './NewsLetter.css'

export const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>
            Get Exclusive Offers On Your Email-id
        </h1>
        <p>
            Subscribe to our NewsLetter and stay updated
        </p>
        <div>
            <input type='email' placeholder="Your email-id"/>
            <button>Subscribe</button>
        </div>

    </div>
  )
}
export default NewsLetter
