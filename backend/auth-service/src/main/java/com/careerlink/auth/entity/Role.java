package com.careerlink.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter
@Setter
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, unique = true, nullable = false)
    private ERole name;

    public Role() {
    }

    public Role(ERole name) {
        this.name = name;
    }

    public Role(Long id, ERole name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ERole getName() { return name; }
    public void setName(ERole name) { this.name = name; }

    public static RoleBuilder builder() {
        return new RoleBuilder();
    }

    public static class RoleBuilder {
        private Long id;
        private ERole name;

        public RoleBuilder id(Long id) { this.id = id; return this; }
        public RoleBuilder name(ERole name) { this.name = name; return this; }

        public Role build() {
            Role r = new Role();
            r.id = this.id;
            r.name = this.name;
            return r;
        }
    }
}
