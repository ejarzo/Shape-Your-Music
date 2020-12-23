import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { formatTimestamp } from 'utils/time';
import { ROUTES } from 'Routes';
import { Button, Pagination } from 'antd';
import { Stage, Layer, Line } from 'react-konva';
import { appColors, themeColors } from 'utils/color';
import { useColorThemeContext } from 'context/ColorThemeContext/useColorThemeContext';
import Color from 'color';

function ProjectList(props) {
  const { title, projects } = props;
  const { isDarkMode } = useColorThemeContext();
  return (
    <div>
      <h1>{title}</h1>
      <div className={styles.projectsGrid}>
        {projects.length === 0 && (
          <div>
            <p>No projects yet</p>
            <Link to={ROUTES.INDEX}>
              <Button>Start Creating!</Button>
            </Link>
          </div>
        )}

        {projects &&
          projects.map(({ _id, name, userName, dateCreated, shapesList }) => {
            return (
              <div key={_id}>
                <Link to={`${ROUTES.PROJECT}/${_id}`}>
                  <div
                    className={cx(styles.ProjectCard, {
                      [styles.isDarkMode]: isDarkMode,
                    })}
                    style={{
                      background:
                        isDarkMode && Color(appColors.black).lighten(0.3),
                      color: isDarkMode && appColors.grayLightest,
                      border: isDarkMode && 'none',
                    }}
                  >
                    <Stage
                      style={{
                        background: isDarkMode
                          ? appColors.black
                          : appColors.grayLightest,
                      }}
                      width={200}
                      height={100}
                      scaleX={0.1}
                      scaleY={0.1}
                    >
                      <Layer>
                        {shapesList &&
                          shapesList.map(({ points, colorIndex }) => {
                            return (
                              <Line
                                points={points}
                                fill={themeColors[colorIndex]}
                                opacity={0.8}
                                lineJoin="bevel"
                                closed
                              />
                            );
                          })}
                      </Layer>
                    </Stage>
                    <div>
                      <strong>{name}</strong>
                    </div>
                    <div>
                      by{' '}
                      <em
                        style={{
                          color: userName === 'ejarzo' && themeColors[0],
                        }}
                      >
                        {userName}
                      </em>
                    </div>
                    <div className="text-gray">
                      {dateCreated && formatTimestamp(dateCreated)}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
      </div>
      <div style={{ textAlign: 'center' }}>
        <Pagination
          style={{ margin: '20px auto' }}
          defaultCurrent={1}
          total={50}
        />
      </div>
    </div>
  );
}

export default ProjectList;
