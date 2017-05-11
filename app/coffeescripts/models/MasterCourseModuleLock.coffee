#
# Copyright (C) 2013 - present Instructure, Inc.
#
# This file is part of Canvas.
#
# Canvas is free software: you can redistribute it and/or modify it under
# the terms of the GNU Affero General Public License as published by the Free
# Software Foundation, version 3 of the License.
#
# Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
# WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
# A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
# details.
#
# You should have received a copy of the GNU Affero General Public License along
# with this program. If not, see <http://www.gnu.org/licenses/>.

import Backbone from 'Backbone'

 # need a bit of a model for plugging the LockIconView into the modules page
 # where we don't have the individual item's models, because we're getting lock state
 # after the module page loads via an api request.
 # See public/javascripts/context_modules.js
class MasterCourseModuleLock extends Backbone.Model
  defaults:
    is_master_course_master_content: false
    is_master_course_child_content: false
    restricted_by_master_course: false

export default MasterCourseModuleLock