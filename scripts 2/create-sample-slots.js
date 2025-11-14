import { createClient } from '@supabase/supabase-js'

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createSampleSlots() {
  try {
    console.log('🚀 Creating sample availability slots...')

    // First, let's create a sample doctor profile
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: 'doctor@wecarewellness.com',
      password: 'temp-password-123'
    })

    if (authError && authError.message !== 'User already registered') {
      console.error('❌ Error creating auth user:', authError)
      return
    }

    const doctorId = authUser?.user?.id || 'existing-doctor-id'
    console.log('👨‍⚕️ Doctor ID:', doctorId)

    // Create doctor profile
    const { data: doctorProfile, error: profileError } = await supabase
      .from('doctor_profiles')
      .upsert({
        user_id: doctorId,
        name: 'Dr. Sarah Johnson',
        specialization: 'Mental Health Counselor',
        bio: 'Experienced therapist specializing in anxiety and depression treatment.'
      })
      .select()

    if (profileError) {
      console.error('❌ Error creating doctor profile:', profileError)
    } else {
      console.log('✅ Doctor profile created:', doctorProfile)
    }

    // Create availability slots for the next 7 days
    const slots = []
    const today = new Date()
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Skip weekends for this example
      if (date.getDay() === 0 || date.getDay() === 6) continue
      
      // Create morning slots (9 AM, 10 AM, 11 AM)
      for (let hour = 9; hour <= 11; hour++) {
        const startTime = new Date(date)
        startTime.setHours(hour, 0, 0, 0)
        
        const endTime = new Date(startTime)
        endTime.setHours(hour + 1, 0, 0, 0)
        
        slots.push({
          doctor_id: doctorId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          appointment_type: 'consultation',
          is_available: true,
          notes: 'Available for new patient consultations'
        })
      }
      
      // Create afternoon slots (2 PM, 3 PM, 4 PM)
      for (let hour = 14; hour <= 16; hour++) {
        const startTime = new Date(date)
        startTime.setHours(hour, 0, 0, 0)
        
        const endTime = new Date(startTime)
        endTime.setHours(hour + 1, 0, 0, 0)
        
        slots.push({
          doctor_id: doctorId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          appointment_type: 'consultation',
          is_available: true,
          notes: 'Available for follow-up appointments'
        })
      }
    }

    console.log(`📅 Creating ${slots.length} availability slots...`)

    // Insert all slots
    const { data: createdSlots, error: slotsError } = await supabase
      .from('availability_slots')
      .insert(slots)
      .select()

    if (slotsError) {
      console.error('❌ Error creating availability slots:', slotsError)
    } else {
      console.log(`✅ Successfully created ${createdSlots.length} availability slots!`)
      console.log('🎉 Sample data created successfully!')
      console.log('📝 You can now test the booking functionality at /book-appointment')
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

createSampleSlots()
