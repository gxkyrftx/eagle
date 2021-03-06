/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
	'use strict';

	var serviceModule = angular.module('eagle.service');
	serviceModule.service('$wrapState', function($state, $location, $stateParams) {
		var $wrapState = {};
		var _targetState = null;
		var _targetPriority = 0;

		// Go
		$wrapState.go = function(state, param, option, priority) {
			setTimeout(function() {
				_targetState = null;
				_targetPriority = 0;
			});

			if(typeof param !== "object") {
				priority = param;
				param = {};
				option = {};
			} else if(typeof option !== "object") {
				priority = option;
				option = {};
			}

			priority = priority === true ? 1 : (priority || 0);
			if(_targetPriority > priority) {
				console.log("[Wrap State] Go - low priority:", state, "(Skip)");
				return false;
			}

			if(_targetState !== state || priority) {
				if($state.current && $state.current.name === state && angular.equals($state.params, param)) {
					console.log("[Wrap State] Go reload.", $state);
					$state.reload();
				} else {
					console.log("[Wrap State] Go:", state, param, priority);
					$state.go(state, param, option);
				}
				_targetState = state;
				_targetPriority = priority;
				return true;
			} else {
				console.log("[Wrap State] Go:", state, "(Ignored)");
			}
			return false;
		};

		// Reload
		$wrapState.reload = function() {
			console.log("[Wrap State] Do reload.");
			$state.reload();
		};

		// Path
		$wrapState.path = function(path) {
			if(path !== undefined) {
				console.log("[Wrap State][Deprecated] Switch path:", path);
			}
			return $location.path(path);
		};

		// URL
		$wrapState.url = function(url) {
			if(url !== undefined) console.log("[Wrap State] Switch url:", url);
			return $location.url(url);
		};

		Object.defineProperties($wrapState, {
			// Origin $state
			origin: {
				get: function() {
					return $state;
				}
			},

			// Current
			current: {
				get: function() {
					return $state.current;
				}
			},

			// Parameter
			param: {
				get: function() {
					return $.extend({}, $location.search(), $stateParams);
				}
			},

			// State
			state: {
				get: function() {
					return $state;
				}
			}
		});

		$wrapState.search = $location.search.bind($location);
		$wrapState.$location = $location;

		return $wrapState;
	});
})();
