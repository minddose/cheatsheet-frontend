import { Button, Grid } from '@material-ui/core'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import { useCallback, useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import shallow from 'zustand/shallow'
import useStepsStore from '../../../../stores/StepsStore'

const StepsBottomNavigation = () => {
  const [showNextButton, setShowNextButton] = useState(true)
  const [showPrevious, setShowPrevious] = useState(false)
  const [
    activeStep,
    totalSteps,
    completedSteps,
    setActiveStep,
    getStepData,
    isStepCompleted,
    isStepRequired
  ] = useStepsStore(
    state => [
      state.activeStep,
      state.totalSteps,
      state.completedSteps,
      state.setActiveStep,
      state.getStepData,
      state.isStepCompleted,
      state.isStepRequired
    ],
    shallow
  )

  useEffect(() => {
    setShowNextButton(activeStep + 1 < totalSteps)
    setShowPrevious(activeStep > 0)
  }, [activeStep, totalSteps])

  const renderNextButtonCallback = useCallback(
    () => (
      <Grid item>
        <Button
          component={RouterLink}
          to={getStepData(activeStep + 1)?.route || ''}
          onClick={() => setActiveStep(activeStep + 1)}
          variant='contained'
          color='primary'
          endIcon={<ChevronRight />}
          disabled={!isStepCompleted(activeStep) && isStepRequired(activeStep)}
          disableRipple={true}>
          Next
        </Button>
      </Grid>
    ),
    // eslint-disable-next-line
    [activeStep, completedSteps, isStepCompleted, isStepRequired]
  )

  return (
    <Grid container justify={showPrevious ? 'space-between' : 'flex-end'}>
      {showPrevious && (
        <Grid item>
          <Button
            component={RouterLink}
            to={getStepData(activeStep - 1)?.route || ''}
            onClick={() => setActiveStep(activeStep - 1)}
            color='primary'
            startIcon={<ChevronLeft />}
            disableRipple={true}>
            Back
          </Button>
        </Grid>
      )}

      {showNextButton && renderNextButtonCallback()}
    </Grid>
  )
}

export default StepsBottomNavigation
