<div class="tinyeditor">
    <div class="tinyeditor-header" ng-hide="editMode">
        <div
            ng-hide="editMode"
            layout="column">

            <div id="tinyeditor_left_controls" layout="column">

                <choose-file-button style="max-width : 133px; height : 64px">
                    <!-- <md-button
                        aria-label="Upload a file"
                        class="md-raised tinyeditor-control"
                        style="background-position-y: -600px;"
                        ng-click="insertImage()">
                    </md-button> -->

                    <md-button
                        id="tinyeditor_take_photo"
                        class="md-raised md-mobilot"
                        aria-label="Photo hochladen"
                        ng-click="insertImage()">

                        <md-icon>photo_camera</md-icon>
                        <span>Photo</span>
                    </md-button>

                    <input
                        type="file"
                        onchange="angular.element( this ).scope().uploadFile( this )"
                        accept="image/*">
                </choose-file-button>

                <div layout="column" flex>
                    <div
                        layout-sm="row"
                        layout-align="space-between end"
                        flex>
                        <md-button
                            class="custom-wysiwyg-button md-mobilot"
                            aria-label="Text"
                            ng-click="changeTextStyle('p')">Text
                        </md-button>
                        <md-button
                            class="custom-wysiwyg-button md-mobilot"
                            aria-label="Titel"
                            ng-click="changeTextStyle('h1')">Titel
                        </md-button>

                          <md-button
                            class="custom-wysiwyg-button md-mobilot"
                            aria-label="Untertitel"
                            ng-click="changeTextStyle('h2')">Untertitel
                        </md-button>

                    </div>
                    <div
                        layout-sm="row"
                        layout-align="space-around center">

                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Fett"
                            ng-click="execCommand('bold')">

                            <md-icon>format_bold</md-icon>
                        </md-button>
                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Kursiv"
                            ng-click="execCommand('italic')">

                            <md-icon>format_italic</md-icon>
                        </md-button>

                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Unterstriechen"
                            ng-click="execCommand('underline')">

                            <md-icon>format_underlined</md-icon>
                        </md-button>
                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Durchstreichen"
                            ng-click="execCommand('strikethrough')">

                            <md-icon>format_strikethrough</md-icon>
                        </md-button>

                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Geordnete Liste"
                            ng-click="execCommand('insertorderedlist')">

                            <md-icon>format_list_numbered</md-icon>
                        </md-button>
                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Ungeordnete Liste"
                            ng-click="execCommand('insertunorderedlist')">

                            <md-icon>format_list_bulleted</md-icon>
                        </md-button>

                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Einrücken"
                            ng-click="execCommand('outdent')">

                            <md-icon>format_indent_decrease</md-icon>
                        </md-button>
                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Einzug"
                            ng-click="execCommand('indent')">

                            <md-icon>format_indent_increase</md-icon>
                        </md-button>
                    </div>

                    <div
                        layout-sm="row"
                        layout-align="space-around start"
                        flex>

                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Links ausrichten"
                            ng-click="execCommand('justifyleft')">

                            <md-icon>format_align_left</md-icon>
                        </md-button>
                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Zentrieren"
                            ng-click="execCommand('justifycenter')">

                            <md-icon>format_align_center</md-icon>
                        </md-button>

                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Rechts ausrichten"
                            ng-click="execCommand('justifyright')">

                            <md-icon>format_align_right</md-icon>
                        </md-button>
                        <md-button
                            class="md-raised ng-scope md-mobilot tinyeditor-control"
                            aria-label="Formatierung löschen"
                            ng-click="execCommand('removeformat')">

                            <md-icon>format_clear</md-icon>
                        </md-button>

                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Verlinkung entvernen"
                            ng-click="execCommand('unlink')">

                            <md-icon>leak_remove</md-icon>
                        </md-button>
                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Verlinkung hinzufügen"
                            ng-click="insertLink()">

                            <md-icon>insert_link</md-icon>
                        </md-button>

                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Rückgängig"
                            ng-click="execCommand('undo')">

                            <md-icon>undo</md-icon>
                        </md-button>
                        <md-button
                            class="md-raised md-mobilot tinyeditor-control"
                            aria-label="Wiederherstellen"
                            ng-click="execCommand('redo')">

                            <md-icon>redo</md-icon>
                        </md-button>
                    </div>


                </div>


                <!-- <md-select
                    ng-model="textstyle"
                    placeholder="Formatvorlage auswählen"
                    class="tinyeditor-select"
                    flex>

                    <md-option
                        ng-repeat="s in styles"
                        value="{{ s.key }}">
                            {{ s.name }}
                    </md-option>
                </md-select> -->
            </div>

          <!--<div class="btn-group">
          		<select class="md-raised dropdown-toggle" ng-model="font" ng-options="a as a for a in fonts">
          			<option value="">Font</option>
          		</select>
          		<select class="md-raised dropdown-toggle" ng-model="fontsize" ng-options="a as a for a in fontsizes">
          			<option value="">...</option>
          		</select>
          		<select class="md-raised dropdown-toggle" ng-model="textstyle" ng-options="s.key as s.name for s in styles">
          			<option value="">Style</option>
          		</select>
          </div>-->
          <!--<md-button class="md-raised tinyeditor-control" aria-label="Color" style="background-position-y: -779px; position: relative;" ng-click="showFontColors = !showFontColors">
          	    	<colors-grid show="showFontColors" on-pick="setFontColor(color)"><colors-grid>
          		</md-button>
          		<md-button class="md-raised tinyeditor-control" aria-label="Background" style="background-position-y: -808px; position: relative;" ng-click="showBgColors = !showBgColors">
          	    	<colors-grid show="showBgColors" on-pick="setBgColor(color)"><colors-grid>
          		</md-button>

          		<md-button class="md-raised tinyeditor-control" aria-label="Image" style="background-position-y: -600px;" ng-click="insertImage()"></md-button>
          		<!--<md-button class="md-raised tinyeditor-control" aria-label="Divider" style="background-position-y: -630px;" ng-click="execCommand('inserthorizontalrule')"></md-button>
          		<md-button class="md-raised tinyeditor-control" aria-label="Symbol" style="background-position-y: -838px; position: relative;" ng-click="showSpecChars = !showSpecChars">
          	    	<symbols-grid show="showSpecChars" on-pick="insertSpecChar(symbol)"><symbols-grid>
          		</md-button>-->
        <!-- <div class="sizer"> -->
            <div class="sizer editor-control" flex>
          		<textarea
                    data-placeholder-attr=""
                    style="-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; resize: none; width: 100%; height: 100%;"
                    ng-show="editMode"
                    ng-model="content">
          		</textarea>

          		<iframe
                    id="editor_iframe"
                    style="-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; width: 100%; height: 100%;"
                    ng-hide="editMode"
                    wframe=""
                    ng-model="content">
          		</iframe>
            </div>
        </div>
    </div>
    <!-- <div class="tinyeditor-footer">
		<div ng-switch="editMode" ng-click="editMode = !editMode" class="toggle">
			<span ng-switch-when="true">wysiwyg</span>
			<span ng-switch-default>source</span>
		</div>
    </div> -->
    <ul>
        <li ng-repeat="item in uploader.queue">
            Name: <span ng-bind="item.file.name"></span><br>
            <button ng-click="item.upload()">upload</button>
        </li>
    </ul>
</div>
