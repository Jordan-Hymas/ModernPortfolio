'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SkillIcon from './skills/SkillIcon';
import type { WindowsViewportDensity } from '@/hooks/useWindowsViewportDensity';

// Skill interface
interface Skill {
  name: string;
  icon?: string;
  fallbackColor: string;
}

interface SkillsProps {
  density?: WindowsViewportDensity;
}

const Skills = ({ density = 'default' }: SkillsProps) => {
  const [isMobileRipple, setIsMobileRipple] = useState(false);
  const [rippleCenterIndex, setRippleCenterIndex] = useState<number | null>(null);
  const [rippleWaveId, setRippleWaveId] = useState(0);

  // Flat array of all skills matching the exact icons in public/icons/skills
  const skillsData: Skill[] = [
    // Programming Languages
    { name: 'Python', icon: '/icons/skills/python.svg', fallbackColor: '#3776AB' },
    { name: 'C', icon: '/icons/skills/c.svg', fallbackColor: '#A8B9CC' },
    { name: 'C++', icon: '/icons/skills/c++.svg', fallbackColor: '#00599C' },
    { name: 'C#', icon: '/icons/skills/cSharp.svg', fallbackColor: '#239120' },
    { name: 'Bash', icon: '/icons/skills/bash.svg', fallbackColor: '#4EAA25' },

    // Web Languages
    { name: 'HTML', icon: '/icons/skills/httml.svg', fallbackColor: '#E34F26' },
    { name: 'CSS', icon: '/icons/skills/css.svg', fallbackColor: '#1572B6' },
    { name: 'JavaScript', icon: '/icons/skills/javascript.svg', fallbackColor: '#F7DF1E' },
    { name: 'TypeScript', icon: '/icons/skills/typescript.svg', fallbackColor: '#3178C6' },
    { name: 'Tailwind', icon: '/icons/skills/tailwind.svg', fallbackColor: '#06B6D4' },

    // Operating Systems
    { name: 'macOS', icon: '/icons/skills/mac.svg', fallbackColor: '#000000' },
    { name: 'Linux', icon: '/icons/skills/linux.svg', fallbackColor: '#FCC624' },
    { name: 'Windows', icon: '/icons/skills/windows.svg', fallbackColor: '#0078D6' },
    { name: 'Kali', icon: '/icons/skills/kali.svg', fallbackColor: '#557C94' },

    // Tools & Frameworks
    { name: 'Git', icon: '/icons/skills/git.svg', fallbackColor: '#F05032' },
    { name: 'NPM', icon: '/icons/skills/npm.svg', fallbackColor: '#CB3837' },
    { name: 'React', icon: '/icons/skills/react.svg', fallbackColor: '#61DAFB' },
    { name: 'Docker', icon: '/icons/skills/docker.svg', fallbackColor: '#2496ED' },
    { name: 'Node.js', icon: '/icons/skills/nodeJS.svg', fallbackColor: '#339933' },

    // Databases
    { name: 'SQLite', icon: '/icons/skills/sqlLight.svg', fallbackColor: '#003B57' },
  ];

  const isCompactDensity = density === 'compact' || density === 'tight';
  const isTightDensity = density === 'tight';
  const gridClass = isTightDensity
    ? 'grid grid-cols-4 gap-2 px-1 sm:grid-cols-5 sm:gap-3 lg:gap-4'
    : isCompactDensity
      ? 'grid grid-cols-4 gap-2.5 px-1 sm:grid-cols-5 sm:gap-4 lg:gap-5'
      : 'grid grid-cols-4 gap-3 px-2 sm:grid-cols-5 sm:gap-5 lg:gap-7';

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 639px)');
    const update = (matches: boolean) => {
      setIsMobileRipple(matches);
    };
    update(mobileQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      update(event.matches);
    };

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', onChange);
      return () => mobileQuery.removeEventListener('change', onChange);
    }

    mobileQuery.addListener(onChange);
    return () => mobileQuery.removeListener(onChange);
  }, []);

  const triggerRipple = useCallback((centerIndex: number) => {
    if (!isMobileRipple) return;
    setRippleCenterIndex(centerIndex);
    setRippleWaveId(prev => prev + 1);
  }, [isMobileRipple]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <Card className="w-full border-none bg-transparent shadow-none">
        {/* Launchpad Grid - Single Continuous Grid */}
        <CardContent className="px-0">
          <div className={gridClass}>
            {skillsData.map((skill, index) => (
              <SkillIcon
                key={index}
                name={skill.name}
                icon={skill.icon}
                fallbackColor={skill.fallbackColor}
                index={index}
                density={density}
                rippleCenterIndex={isMobileRipple ? rippleCenterIndex : null}
                rippleWaveId={isMobileRipple ? rippleWaveId : 0}
                rippleColumns={4}
                onTriggerRipple={isMobileRipple ? () => triggerRipple(index) : undefined}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Skills;
