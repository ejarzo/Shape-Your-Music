import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { formatTimestamp } from 'utils/time';
import { ROUTES } from 'Routes';
import { Button } from 'antd';
import { Stage, Layer, Line } from 'react-konva';
import { themeColors } from 'utils/color';

function ProjectList(props) {
  const { title, projects } = props;
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
                  <div className={styles.ProjectCard}>
                    <Stage
                      style={{ background: '#eee' }}
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
    </div>
  );
}

export default ProjectList;
