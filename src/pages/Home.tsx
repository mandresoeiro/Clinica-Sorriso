import { Hero } from '../components/sections/Hero'
import { TreatmentsSection } from '../components/sections/TreatmentsSection'
import { ClinicIntro } from '../components/sections/ClinicIntro'
import { TeamPreview } from '../components/sections/TeamPreview'
import { AppointmentForm } from '../components/sections/AppointmentForm'
import { LocationSection } from '../components/sections/LocationSection'

export function Home() {
  return (
    <>
      <Hero />
      <TreatmentsSection />
      <ClinicIntro />
      <TeamPreview />
      <AppointmentForm />
      <LocationSection />
    </>
  )
}
