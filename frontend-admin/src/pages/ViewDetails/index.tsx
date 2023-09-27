import { Button } from 'antd'
import React from 'react'
import blue from '@/assets/blue.png'
import { RollbackOutlined } from '@ant-design/icons'
import { history } from 'umi'
import Page from '@/components/Page'
import Breadcrumbs from '@/components/BreadCrumbs'

const ViewUserDetails = () => {


  // get data from the API call 
  return (
    <Page
      title="DASHBOARD"
      PrevNextNeeded="N"

      breadcrumbs={
        <Breadcrumbs
          path={[
            {
              name: 'Dashboard',
              path: '/dashboard',
            },
            {
              name: 'Manage Users',
              path: '/users',
            },
            {
              name: 'User Details',
              path: '/view-user-details',
            },

          ]}
        />
      }
    >
      <div className='flex flex-col bg-[#eee] h-full '>
        <div className='text-xl text-center font-bold my-4 flex justify-between items-center px-6 border-t-2 rounded-md border-b-2 border-r-2 border-l-2 shadow-lg  py-5  mt-4'>
          <div className='flex '>
            <UserCardName text='R' />
            <span className='flex justify-center items-center px-8'>User Name</span>
          </div>
          <span className='mr-8'>Status</span>
        </div>
        <div className='flex px-4 mt-8 ' >
          <div className='flex  items-center justify-center'>
            <img src={blue} alt='blue' style={{ width: '150px', height: '200px'}} />
          </div>

          <span className='text-xl ml-4  w-[80%]' style={{width:'80%'}}>user Bio:-  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla ut facere accusamus, rerum enim vero repudiandae voluptate animi dicta sequi numquam minima pariatur blanditiis reprehenderit soluta, eos eius laboriosam fuga.</span>
        </div>
        <div className='grid grid-cols-4  mt-4 text-xl p-4 '>
          <p>Joining Data : 23/05/20222</p>
          <p>Crux : 899</p>
          <p>Total no. of posts : 99</p>
          <p>Total Reshared posts : 99</p>
          <p>No. of Warnings : 99</p>
        </div>
        <div className='grid grid-cols-4  mt-4 text-xl p-4 '>
          <p>Total coins earned: 333</p>
          <p>Coins balance : 899</p>
          <p>Last post published on : 32/12/2099</p>
          <p>No. of reports submitted  : 99</p>
          <p>No. of posts that got reported : 199</p>
        </div>
        <div className='mt-10 flex justify-between ' style={{ width: '60%' }}>
          <Button type='primary' block={false} style={{ background: 'red' }}> Warning</Button>
          <Button type='primary'>  Spankee </Button>
          <Button type='primary'> Option to deduct coins</Button>
        </div>
        <div className='w-full  absolute bottom-0 right-0 '>
          <Button style={{ float: 'right', background: '#8A8AFF', position: 'relative', bottom: '10px', right: '300px' }} icon={<RollbackOutlined />} onClick={() => { history.goBack() }}>Go Back</Button>
        </div>

      </div>
    </Page>
  )
}

export default ViewUserDetails

const UserCardName = ({ text }) => {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  console.log('randomColor', randomColor)
  return <div className='  flex justify-center items-center text-6xl shadow-md text-white ' style={{ width: '100px', height: '100px', background: `#${randomColor} ` }}>
    <span className=''> {text}</span>
  </div>
}