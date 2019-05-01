import { SELECT_PROJECT, GET_PROJECTS, FETCH_PROJECT, FREE, FETCH_CODEC_LIST } from '../constants/AppConstants'
import _ from 'underscore'

const assign = Object.assign || require('object.assign')

export function projectReducer (state = [], action) {
  switch (action.type) {
    case GET_PROJECTS:
      state = []
      return [
        ...state,
        ...action.newState.projects
      ]
    case FETCH_PROJECT:
      if (_.find(state, { _id: action.newState.project._id }) !== undefined) {
        return state.map((currentItem, index) => {
          if (action.newState.project._id === currentItem._id) {
            return {
              ...action.newState.project,
              currentItem
            }
          } else {
            return currentItem
          }
        })
      } else {
        return [
          ...state,
          action.newState.project
        ]
      }
    case FETCH_CODEC_LIST:
      if (_.find(state, { _id: action.id }) !== undefined) {
        return state.map((currentItem, index) => {
          if (action.id === currentItem._id) {
            currentItem['templates'] = action.newState.codecs
            return currentItem
          } else {
            return currentItem
          }
        })
      }
    case FREE:
      return []
    default:
      return state
  }
}
