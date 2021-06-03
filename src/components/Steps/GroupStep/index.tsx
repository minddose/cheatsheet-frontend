import { useTheme } from '@material-ui/core'
import { CSSProperties, useEffect, useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import shallow from 'zustand/shallow'
import { ungroupedTopicsDroppableId } from '../../../constants/steps'
import useStepsStore from '../../../stores/StepsStore'
import { TopicGroup } from '../../../types/topic'
import DndTopicList from '../Lists/DndTopicList'
import useTopicStyles from '../Lists/styles/topic'
import EditGroupNameDialog from './EditGroupNameDialog'
import { default as TopicGroupComponent } from './TopicGroup'

const getTopicStylesListOverrides = (hasTopics: boolean, padding?: number): CSSProperties => ({
  padding: hasTopics ? 0 : `${padding}px 0 ${padding}px 0`
})

const GroupStep = () => {
  const topicClasses = useTopicStyles()
  const theme = useTheme()
  const [topics, topicGroups, groupTopics, moveTopic, renameTopicGroup, setStepState] = useStepsStore(
    state => [
      state.ungroupedTopics,
      state.topicGroups,
      state.groupTopics,
      state.moveTopic,
      state.renameTopicGroup,
      state.setStepState
    ],
    shallow
  )

  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [id, setId] = useState('')

  const onDragEnd = (dropResult: DropResult) => {
    const { draggableId, combine, source, destination } = dropResult

    if (combine) groupTopics(draggableId, combine.draggableId)
    if (destination) moveTopic(source, destination)
  }

  const handleOnDialogSaveClick = () => {
    if (!name) return

    renameTopicGroup(id, name.trim())
    setOpen(false)
  }

  useEffect(() => setStepState(true), [setStepState])

  return (
    <div className={topicClasses.list}>
      <DragDropContext onDragEnd={onDragEnd}>
        {topicGroups.map(({ id, name, topics }: TopicGroup) => {
          return (
            <TopicGroupComponent
              key={id}
              id={id}
              name={name}
              topics={topics}
              editButtonOnClickHandler={e => {
                e.stopPropagation()
                setId(id)
                setOpen(true)
              }}
            />
          )
        })}
        <DndTopicList
          topics={topics}
          droppableId={ungroupedTopicsDroppableId}
          isCombineEnabled={true}
          listStyle={getTopicStylesListOverrides(!!topics.length, theme.spacing(2))}
        />
      </DragDropContext>
      <EditGroupNameDialog
        open={open}
        onSaveHandler={handleOnDialogSaveClick}
        onCloseHandler={() => setOpen(false)}
        name={name}
        setName={setName}
      />
    </div>
  )
}

export default GroupStep
